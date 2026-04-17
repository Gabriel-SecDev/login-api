// src/server.js
import app from './app.js'

const PORT = process.env.PORT || 3000

try {
  // Aqui a gente manda o Fastify escutar na porta definida
  // '0.0.0.0' significa que aceita conexão de qualquer interface de rede
  // Se fosse '127.0.0.1', só aceitaria conexão local
  await app.listen({ port: PORT, host: '0.0.0.0' })
} catch (err) {
  app.log.error(err)
  process.exit(1)
}