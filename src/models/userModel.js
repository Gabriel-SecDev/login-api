// src/models/userModel.js
import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pg

// Pool é um conjunto de conexões reutilizáveis com o banco
// Em vez de abrir e fechar uma conexão a cada query (lento),
// o Pool mantém conexões abertas e as distribui conforme necessário
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
})

// Função que inicializa as tabelas no banco
// O IF NOT EXISTS garante que ela não quebra se já existir
export async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id        SERIAL PRIMARY KEY,
      email     VARCHAR(255) UNIQUE NOT NULL,
      password  VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS revoked_tokens (
      jti        VARCHAR(255) PRIMARY KEY,
      revoked_at TIMESTAMP DEFAULT NOW()
    );
  `)
  console.log('Tabelas verificadas/criadas com sucesso')
}

// Busca um usuário pelo email
// Usamos $1 em vez de concatenar string diretamente — isso previne SQL Injection
export async function findUserByEmail(email) {
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  )
  return result.rows[0]
}

// Cria um novo usuário no banco
// A senha que chega aqui já vem com hash — nunca salvamos senha pura
export async function createUser(email, hashedPassword) {
  const result = await pool.query(
    'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email, created_at',
    [email, hashedPassword]
  )
  return result.rows[0]
}

// Salva o JTI do token na blacklist quando o usuário faz logoff
export async function revokeToken(jti) {
  await pool.query(
    'INSERT INTO revoked_tokens (jti) VALUES ($1)',
    [jti]
  )
}

// Verifica se um token já foi revogado
export async function isTokenRevoked(jti) {
  const result = await pool.query(
    'SELECT 1 FROM revoked_tokens WHERE jti = $1',
    [jti]
  )
  return result.rows.length > 0
}

export default pool