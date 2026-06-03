import { prisma } from '../lib/prisma.js'

function withAvgRating(recipe) {
  const { ratings, ...rest } = recipe
  const avg = ratings?.length
    ? ratings.reduce((s, r) => s + r.score, 0) / ratings.length
    : null
  return { ...rest, avgRating: avg ? Math.round(avg * 10) / 10 : null }
}

export async function recipeRoutes(fastify) {
  // GET /api/recipes
  fastify.get('/', async (request) => {
    const { search, country, type, diet, page = '1', limit = '12' } = request.query
    const where = {}
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { country: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { ingredientText: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (country) where.country = { contains: country, mode: 'insensitive' }
    if (type) where.type = type
    if (diet) where.diet = { hasEvery: diet.split(',') }

    const skip = (parseInt(page) - 1) * Math.min(parseInt(limit), 50)
    const take = Math.min(parseInt(limit), 50)

    const [recipes, total] = await Promise.all([
      prisma.recipe.findMany({
        where, skip, take,
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { id: true, name: true } },
          ratings: { select: { score: true } },
          _count: { select: { favorites: true } },
        },
      }),
      prisma.recipe.count({ where }),
    ])

    return { recipes: recipes.map(withAvgRating), total, page: parseInt(page), totalPages: Math.ceil(total / take) }
  })

  // GET /api/recipes/:id
  fastify.get('/:id', async (request, reply) => {
    const recipe = await prisma.recipe.findUnique({
      where: { id: request.params.id },
      include: {
        author: { select: { id: true, name: true } },
        ratings: { include: { user: { select: { id: true, name: true } } } },
        comments: {
          include: { user: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'desc' },
        },
        _count: { select: { favorites: true } },
      },
    })
    if (!recipe) return reply.code(404).send({ error: 'Recette introuvable' })
    return withAvgRating(recipe)
  })

  // POST /api/recipes
  fastify.post('/', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const { title, description, country, type, diet, ingredients, steps, imageUrl, prepTime, servings } = request.body ?? {}
    if (!title || !description || !country || !type || !ingredients || !steps)
      return reply.code(400).send({ error: 'Champs obligatoires manquants' })

    const ingredientText = Array.isArray(ingredients) ? ingredients.map((i) => i.name).join(' ') : ''
    const recipe = await prisma.recipe.create({
      data: {
        title, description, country, type,
        diet: diet ?? [],
        ingredients, ingredientText, steps,
        imageUrl: imageUrl || null,
        prepTime: prepTime ? parseInt(prepTime) : null,
        servings: servings ? parseInt(servings) : null,
        authorId: request.user.sub,
      },
      include: { author: { select: { id: true, name: true } } },
    })
    return reply.code(201).send(recipe)
  })

  // PUT /api/recipes/:id
  fastify.put('/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const existing = await prisma.recipe.findUnique({ where: { id: request.params.id } })
    if (!existing) return reply.code(404).send({ error: 'Recette introuvable' })
    if (existing.authorId !== request.user.sub) return reply.code(403).send({ error: 'Accès refusé' })

    const { title, description, country, type, diet, ingredients, steps, imageUrl, prepTime, servings } = request.body ?? {}
    const ingredientText = Array.isArray(ingredients) ? ingredients.map((i) => i.name).join(' ') : existing.ingredientText

    const recipe = await prisma.recipe.update({
      where: { id: request.params.id },
      data: {
        title, description, country, type, diet, ingredients, ingredientText, steps,
        imageUrl,
        prepTime: prepTime !== undefined ? (prepTime ? parseInt(prepTime) : null) : existing.prepTime,
        servings: servings !== undefined ? (servings ? parseInt(servings) : null) : existing.servings,
      },
      include: { author: { select: { id: true, name: true } } },
    })
    return recipe
  })

  // DELETE /api/recipes/:id
  fastify.delete('/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const existing = await prisma.recipe.findUnique({ where: { id: request.params.id } })
    if (!existing) return reply.code(404).send({ error: 'Recette introuvable' })
    if (existing.authorId !== request.user.sub) return reply.code(403).send({ error: 'Accès refusé' })
    await prisma.recipe.delete({ where: { id: request.params.id } })
    return { message: 'Recette supprimée' }
  })

  // POST /api/recipes/:id/ratings
  fastify.post('/:id/ratings', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const { score } = request.body ?? {}
    if (!score || score < 1 || score > 5)
      return reply.code(400).send({ error: 'La note doit être entre 1 et 5' })

    const recipe = await prisma.recipe.findUnique({ where: { id: request.params.id } })
    if (!recipe) return reply.code(404).send({ error: 'Recette introuvable' })

    const rating = await prisma.rating.upsert({
      where: { userId_recipeId: { userId: request.user.sub, recipeId: request.params.id } },
      update: { score },
      create: { userId: request.user.sub, recipeId: request.params.id, score },
    })
    return rating
  })

  // POST /api/recipes/:id/comments
  fastify.post('/:id/comments', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const { content } = request.body ?? {}
    if (!content?.trim()) return reply.code(400).send({ error: 'Le commentaire ne peut pas être vide' })

    const recipe = await prisma.recipe.findUnique({ where: { id: request.params.id } })
    if (!recipe) return reply.code(404).send({ error: 'Recette introuvable' })

    const comment = await prisma.comment.create({
      data: { content: content.trim(), userId: request.user.sub, recipeId: request.params.id },
      include: { user: { select: { id: true, name: true } } },
    })
    return reply.code(201).send(comment)
  })

  // DELETE /api/recipes/:id/comments/:commentId
  fastify.delete('/:id/comments/:commentId', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const comment = await prisma.comment.findUnique({ where: { id: request.params.commentId } })
    if (!comment) return reply.code(404).send({ error: 'Commentaire introuvable' })
    if (comment.userId !== request.user.sub) return reply.code(403).send({ error: 'Accès refusé' })
    await prisma.comment.delete({ where: { id: request.params.commentId } })
    return { message: 'Commentaire supprimé' }
  })
}
