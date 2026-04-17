
import { registerUser, loginUser } from '../services/authService.js'
import { revokeToken, isTokenRevoked } from '../models/userModel.js'

// REGISTRO
export async function register(request, reply) {
  try {
    const { email, password } = request.body

    // Validação básica de input — nunca confie no que chega na requisição
    if (!email || !password) {
      return reply.status(400).send({ error: 'Email e senha são obrigatórios' })
    }

    // Valida formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return reply.status(400).send({ error: 'Email inválido' })
    }

    // Valida força da senha — mínimo 8 caracteres, 1 número, 1 maiúscula
    if (password.length < 8) {
      return reply.status(400).send({ error: 'Senha deve ter no mínimo 8 caracteres' })
    }

    const user = await registerUser(email, password)

    return reply.status(201).send({
      message: 'Usuário criado com sucesso',
      user
    })

  } catch (err) {
    // Se o service lançou um erro com statusCode, usa ele
    // Senão, é erro interno — 500
    return reply.status(err.statusCode || 500).send({ error: err.message })
  }
}

// LOGIN
export async function login(request, reply) {
  try {
    const { email, password } = request.body

    if (!email || !password) {
      return reply.status(400).send({ error: 'Email e senha são obrigatórios' })
    }

    // Passa o app.jwt.sign pro service — ele não precisa saber que é Fastify
    const result = await loginUser(email, password, request.server.jwt.sign.bind(request.server.jwt))

    return reply.status(200).send(result)

  } catch (err) {
    return reply.status(err.statusCode || 500).send({ error: err.message })
  }
}

// LOGOFF
export async function logout(request, reply) {
  try {
    // Verifica e decodifica o token — se inválido, o Fastify já rejeita aqui
    await request.jwtVerify()

    const { jti } = request.user

    // Verifica se já foi revogado
    const revoked = await isTokenRevoked(jti)
    if (revoked) {
      return reply.status(401).send({ error: 'Token já revogado' })
    }

    // Salva o jti na blacklist
    await revokeToken(jti)

    return reply.status(200).send({ message: 'Logout realizado com sucesso' })

  } catch (err) {
    return reply.status(err.statusCode || 500).send({ error: err.message })
  }
}

// ROTA PROTEGIDA DE EXEMPLO
export async function me(request, reply) {
  try {
    await request.jwtVerify()

    const { jti } = request.user

    // Checa blacklist em toda requisição autenticada
    const revoked = await isTokenRevoked(jti)
    if (revoked) {
      return reply.status(401).send({ error: 'Token revogado, faça login novamente' })
    }

    return reply.status(200).send({
      message: 'Token válido',
      user: request.user
    })

  } catch (err) {
    return reply.status(401).send({ error: 'Token inválido ou expirado' })
  }
}