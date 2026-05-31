import express, { json } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './config/database'
import pool from "./config/database"
import authRoutes from "./routes/authRoutes"
import adminRoutes from "./routes/adminsRoutes"
import patientRoutes from "./routes/patientsRoutes"
import medicRoutes from "./routes/medicRoutes"
import secretaryRoutes from "./routes/secretariesRoutes"
import appointmentRoutes from "./routes/appointmentRoutes"
import specialtiesRoutes from "./routes/specialtiesRoutes"

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
app.get("/test-db", async (req, res) => {
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

//API Routes
app.use('/api', authRoutes);
app.use("/api", patientRoutes)
app.use("/api", medicRoutes)
app.use("/api", secretaryRoutes)
app.use("/api", adminRoutes)
app.use("/api", appointmentRoutes)
app.use("/api", specialtiesRoutes)

const start = async () => {
  try {
    console.log("Iniciando servidor...");
    await connectDB()
    console.log("Banco conectado!");
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
  })
} catch (error) {
  console.error("Erro ao iniciar o servidor:", error)
  }
}

start()