// src/app.js
import fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import fastifyRateLimit from "@fastify/rate-limit";
import dotenv from 'dotenv'
import { initDB } from './models/userModel.js'
import authRoutes from "./routes/auth.js";

dotenv.config()

const app = fastify({ logger: true })

await app.register(fastifyRateLimit, {
  max: 10,
  timeWindow: '1 minute'
})

await app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET
})

// Inicializa as tabelas no banco quando o servidor sobe
// Se as tabelas já existirem, o IF NOT EXISTS garante que não quebra
await initDB()

await app.register(authRoutes)

export default app