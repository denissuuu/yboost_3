import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma.js'

export async function authRoutes(fastify) {
  fastify.post('/register', async (request, reply) => {
    const { name, email, password } = request.body ?? {}
    if (!name || !email || !password) {
      return reply.code(400).send({ error: 'Nom, email et mot de passe requis' })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return reply.code(409).send({ error: 'Email déjà utilisé' })

    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { name, email, password: hashed },
      select: { id: true, name: true, email: true, createdAt: true },
    })

    const token = fastify.jwt.sign({ sub: user.id }, { expiresIn: '7d' })
    return reply.code(201).send({ token, user })
  })

  fastify.post('/login', async (request, reply) => {
    const { email, password } = request.body ?? {}
    if (!email || !password) {
      return reply.code(400).send({ error: 'Email et mot de passe requis' })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return reply.code(401).send({ error: 'Identifiants invalides' })
    }

    const { password: _, ...safeUser } = user
    const token = fastify.jwt.sign({ sub: user.id }, { expiresIn: '7d' })
    return reply.send({ token, user: safeUser })
  })

  fastify.get('/me', { preHandler: [fastify.authenticate] }, async (request) => {
    const user = await prisma.user.findUnique({
      where: { id: request.user.sub },
      select: { id: true, name: true, email: true, createdAt: true },
    })
    if (!user) throw fastify.httpErrors?.notFound?.() ?? { statusCode: 404, message: 'Utilisateur introuvable' }
    return user
  })
}
