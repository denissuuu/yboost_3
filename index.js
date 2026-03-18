const fastify = require('fastify')({ logger: true })

fastify.get('/', async (request, reply) => {
  return { message: 'API recettes du monde' }
})

const start = async () => {
  try {
    await fastify.listen({ port: 5432 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()