// src/routes/auth.js
import { register, login, logout, me } from '../controllers/authController.js'

export default async function authRoutes(app) {

  // REGISTRO
  // POST /auth/register
  // Rota pública — qualquer um pode acessar
  app.post('/auth/register', {
    config: {
      rateLimit: {
        max: 5,           // máximo 5 tentativas
        timeWindow: '1 minute' // por minuto por IP
      }
    }
  }, register)

  // LOGIN
  // POST /auth/login
  // Rota pública com rate limit mais restrito — principal alvo de brute force
  app.post('/auth/login', {
    config: {
      rateLimit: {
        max: 5,
        timeWindow: '1 minute'
      }
    }
  }, login)

  // LOGOFF
  // POST /auth/logout
  // Rota protegida — precisa de token válido
  app.post('/auth/logout', logout)

  // ROTA PROTEGIDA DE EXEMPLO
  // GET /auth/me
  // Retorna os dados do usuário autenticado
  app.get('/auth/me', me)

}