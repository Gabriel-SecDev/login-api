// src/services/authService.js
import bcrypt from 'bcryptjs'
import { findUserByEmail, createUser } from '../models/userModel.js'

// REGISTRO
export async function registerUser(email, password) {

  // Passo 1: verifica se o email já existe
  const existing = await findUserByEmail(email)
  if (existing) {
    // Lança um erro que o controller vai capturar
    const err = new Error('Email já cadastrado')
    err.statusCode = 409 // Conflict
    throw err
  }

  // Passo 2: gera o hash da senha
  // O número 12 é o "salt rounds" — quantas vezes o bcrypt processa a senha
  // Quanto maior, mais seguro e mais lento. 12 é o padrão recomendado hoje
  const hashedPassword = await bcrypt.hash(password, 12)

  // Passo 3: salva no banco — nunca a senha pura, sempre o hash
  const user = await createUser(email, hashedPassword)

  return user
}

// LOGIN
export async function loginUser(email, password, jwtSign) {

  // Passo 1: busca o usuário — se não existir, erro genérico
  const user = await findUserByEmail(email)
  if (!user) {
    const err = new Error('Email ou senha inválidos')
    err.statusCode = 401
    throw err
  }

  // Passo 2: compara a senha enviada com o hash salvo no banco
  // O bcrypt.compare nunca descriptografa — ele rehasha e compara
  const validPassword = await bcrypt.compare(password, user.password)
  if (!validPassword) {
    const err = new Error('Email ou senha inválidos')
    err.statusCode = 401 // mesma mensagem — sem user enumeration
    throw err
  }

  // Passo 3: gera o JWT
  // O payload é o que fica gravado dentro do token
  // jti é o ID único do token — usado na blacklist no logoff
  const token = jwtSign(
    {
      sub: user.id,    // subject — quem é o dono do token
      email: user.email,
      jti: crypto.randomUUID() // ID único gerado pelo próprio Node
    },
    { expiresIn: '1h' }
  )

  return { token, user: { id: user.id, email: user.email } }
}