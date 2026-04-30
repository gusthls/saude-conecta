import express, { json } from 'express'
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
 //Users 
 app.get("/users", async (req, res) => {
  try {
    const response =  await pool.request().query("SELECT * FROM clients")
    
    return res.status(200).json(response.recordset)

  } catch (error) {
    console.error("Erro ao buscar usuário:", error)
    
    return res.status(500).json({
      message: "Erro ao buscar usuário"
    })
  } 
}) 
  app.post("/users", async (req, res) => {
    const { name, cpf, email, phone, password, rc, status_id } = req.body
    
    if (!name || !cpf || !email || !password || !rc || !status_id) {
      return res.status(400).json({
        message: "Campos obrigatórios não preenchidos"
      })
    }
    
    try {
      await pool.request()
      .input("name", name)
      .input("cpf", cpf)
      .input("email", email)
      .input("phone", phone)
      .input("password", password)
      .input("rc", rc)
      .input("status_id", status_id)
      .query(`
        INSERT INTO clients (name, cpf, email, phone, password, rc, status_id)
        VALUES (@name, @cpf, @email, @phone, @password, @rc, @status_id)
      `)

      return res.status(201).json({
        message: "Usuário criado com sucesso"
      })
      
    } catch (error) {
      console.error("Erro ao criar usuário:", error)
      
      return res.status(500).json({
        message: "Erro ao criar usuário"
      })
    }
  })
  
  //Medics
  app.get("medics", async (req, res) => {
    try {
      const response = await pool.request().query("SELECT * FROM medics")

      return res.status(200).json(response.recordset)

    } catch (error) {
      console.error("Erro ao buscar médico:", error)

      return res.status(500).json({
        message: "Erro ao buscar médico"
      })
    }
  })
  
  app.post("/medics", async (req, res) => {
    const {name, cpf, email, phone, password, rm, specialty, status_id } = req.body
    
    if (!name || !cpf || !email || !password || !rm || !specialty || !status_id) {
      return res.status(400).json({
        message: "Campos obrigatórios não preenchidos"
      })
    }
    
    try {
      await pool.request()
      .input("name", name)
      .input("cpf", cpf)
      .input("email", email)
      .input("phone", phone)
      .input("password", password)
      .input("rm", rm)
      .input("specialty", specialty)
      .input("status_id", status_id)
      .query(`
        INSERT INTO medics (name, cpf, email, phone, password, rm, specialty, status_id)
        VALUES (@name, @cpf, @email, @phone, @password, @rm, @specialty, @status_id)
      `)

      return res.status(201).json({
        message: "Médico cadastrado com sucesso"
      })
        
    } catch (error) {
      console.error("Erro ao cadastrar médico:", error)
      
      return res.status(500).json({
        message: "Erro ao cadastrar médico"
      })
    }
  })
  
  //Secretaries
  app.get("/secretaries", async (req, res) => {
    try {
      const response = await pool.request().query("SELECT * FROM secretaries")

      return res.status(200).json(response.recordset)

    } catch (error) {
      console.error("Erro ao buscar secretários", error)

      return res.status(500).json({
        message: "Erro ao buscar secretários"
      })
    }
  })

  app.post("/secretaries", async (req, res) => {
  const { name, cpf, email, phone, password, rs, status_id } = req.body

  if (!name || !cpf || !email || !password || !rs || !status_id) {
    return res.status(400).json({
      message: "Campos obrigatórios não preenchidos"
    })
  }

  try {
    await pool.request()
      .input("name", name)
      .input("cpf", cpf)
      .input("email", email)
      .input("phone", phone)
      .input("password", password)
      .input("rs", rs)
      .input("status_id", status_id)
      .query(`
        INSERT INTO secretaries (name, cpf, email, phone, password, rs, status_id)
        VALUES (@name, @cpf, @email, @phone, @password, @rs, @status_id)
      `)

    return res.status(201).json({
      message: "Secretário cadastrado com sucesso"
    })

  } catch (error) {
    console.error("Erro ao criar secretário:", error)

    return res.status(500).json({
      message: "Erro ao criar secretário"
    })
  }
})

//Admins
app.get("/admins", async (req, res) => {
    try {
      const response = await pool.request().query("SELECT * FROM admins")

      return res.status(200).json(response.recordset)

    } catch (error) {
      console.error("Erro ao buscar administrador", error)

      return res.status(500).json({
        message: "Erro ao buscar administrador"
      })
    }
  })

  app.post("/admins", async (req, res) => {
  const { name, cpf, email, phone, password, ra, status_id } = req.body

  if (!name || !cpf || !email || !password || !ra || !status_id) {
    return res.status(400).json({
      message: "Campos obrigatórios não preenchidos"
    })
  }

  try {
    await pool.request()
      .input("name", name)
      .input("cpf", cpf)
      .input("email", email)
      .input("phone", phone)
      .input("password", password)
      .input("ra", ra)
      .input("status_id", status_id)
      .query(`
        INSERT INTO admins (name, cpf, email, phone, password, ra, status_id)
        VALUES (@name, @cpf, @email, @phone, @password, @ra, @status_id)
      `)

    return res.status(201).json({
      message: "Administrador cadastrado com sucesso"
    })

  } catch (error) {
    console.error("Erro ao criar administradores:", error)

    return res.status(500).json({
      message: "Erro ao criar administradores"
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