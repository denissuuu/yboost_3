import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { authRoutes } from './routes/auth.js'
import { recipeRoutes } from './routes/recipes.js'
import { userRoutes } from './routes/users.js'

const app = Fastify({ logger: true })

await app.register(cors, { origin: true, credentials: true })

await app.register(jwt, {
  secret: process.env.JWT_SECRET || 'change-me-in-production',
})

app.decorate('authenticate', async function (request, reply) {
  try {
    await request.jwtVerify()
  } catch {
    reply.code(401).send({ error: 'Non autorisé' })
  }
})

app.register(authRoutes, { prefix: '/api/auth' })
app.register(recipeRoutes, { prefix: '/api/recipes' })
app.register(userRoutes, { prefix: '/api/users' })

app.setNotFoundHandler((_, reply) => reply.code(404).send({ error: 'Route introuvable' }))
app.setErrorHandler((err, _, reply) => {
  app.log.error(err)
  reply.code(err.statusCode || 500).send({ error: err.message || 'Erreur serveur' })
})

try {
  await app.listen({ port: 3001, host: '0.0.0.0' })
} catch (err) {
  app.log.error(err)
  process.exit(1)
}
