// src/middleware/rateLimiter.js
// Rate limiting específico por rota
// Usado nas rotas de auth.js via config.rateLimit
// O @fastify/rate-limit lê essa configuração automaticamente
// quando registrado no app.js

export const loginRateLimit = {
  max: 5,
  timeWindow: '1 minute',
  errorResponseBuilder: () => ({
    error: 'Muitas tentativas. Tente novamente em 1 minuto.'
  })
}

export const registerRateLimit = {
  max: 5,
  timeWindow: '1 minute',
  errorResponseBuilder: () => ({
    error: 'Muitas tentativas. Tente novamente em 1 minuto.'
  })
}