import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './config/database'
import pool from "./config/database"

dotenv.config()

const app = express()
const PORT = Number(process.env.PORT) || 3000

// Middlewares
app.use(cors())
app.use(express.json())

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'API Saúde Conecta rodando!' })
})

// Route to test the connection to the database
app.get("/users", async (req, res) => {
  try {
    const response = await pool.request().query("SELECT 1 as Teste")

    return res.status(200).json(response.recordset)
    

  } catch (error) {
    console.error("Falha ao buscar dados no banco:", error)

    return res.status(500).json({
      message: "Erro ao processar a requisição"
    })
   }
 })     

const start = async () => {
  try {
   await connectDB()
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
  })
} catch (error) {
  console.error("Erro ao iniciar o servidor:", error)
  }
}

start()