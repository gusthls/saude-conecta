import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './config/database'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middlewares
app.use(cors())
app.use(express.json())

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'API Saúde Conecta rodando!' })
})

const start = async () => {
  await connectDB()
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
  })
}

start()