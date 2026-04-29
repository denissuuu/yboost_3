import { prisma } from '../lib/prisma.js'

function withAvgRating(recipe) {
  const { ratings, ...rest } = recipe
  const avg = ratings?.length
    ? ratings.reduce((s, r) => s + r.score, 0) / ratings.length
    : null
  return { ...rest, avgRating: avg ? Math.round(avg * 10) / 10 : null }
}

export async function userRoutes(fastify) {
  const auth = { preHandler: [fastify.authenticate] }

  // GET /api/users/me
  fastify.get('/me', auth, async (request) => {
    return prisma.user.findUnique({
      where: { id: request.user.sub },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        _count: { select: { recipes: true, favorites: true } },
      },
    })
  })

  // GET /api/users/me/recipes
  fastify.get('/me/recipes', auth, async (request) => {
    const recipes = await prisma.recipe.findMany({
      where: { authorId: request.user.sub },
      orderBy: { createdAt: 'desc' },
      include: {
        ratings: { select: { score: true } },
        _count: { select: { favorites: true } },
      },
    })
    return recipes.map(withAvgRating)
  })

  // GET /api/users/me/favorites
  fastify.get('/me/favorites', auth, async (request) => {
    const favs = await prisma.favorite.findMany({
      where: { userId: request.user.sub },
      include: {
        recipe: {
          include: {
            author: { select: { id: true, name: true } },
            ratings: { select: { score: true } },
            _count: { select: { favorites: true } },
          },
        },
      },
    })
    return favs.map((f) => withAvgRating(f.recipe))
  })

  // POST /api/users/me/favorites/:recipeId
  fastify.post('/me/favorites/:recipeId', auth, async (request, reply) => {
    const { recipeId } = request.params
    const recipe = await prisma.recipe.findUnique({ where: { id: recipeId } })
    if (!recipe) return reply.code(404).send({ error: 'Recette introuvable' })

    await prisma.favorite.upsert({
      where: { userId_recipeId: { userId: request.user.sub, recipeId } },
      update: {},
      create: { userId: request.user.sub, recipeId },
    })
    return reply.code(201).send({ message: 'Ajouté aux favoris' })
  })

  // DELETE /api/users/me/favorites/:recipeId
  fastify.delete('/me/favorites/:recipeId', auth, async (request) => {
    await prisma.favorite.deleteMany({
      where: { userId: request.user.sub, recipeId: request.params.recipeId },
    })
    return { message: 'Retiré des favoris' }
  })
}
