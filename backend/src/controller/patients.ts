import { Request, Response } from "express"
import pool from "../config/database"


export const getPatients = async (req: Request, res: Response) => {
  try {
    const response = await pool.request().query("SELECT * FROM clients")

    return res.status(200).json(response.recordset)

  } catch (error) {
    console.error("Erro ao buscar pacientes:", error)

    return res.status(500).json({
      message: "Erro ao buscar pacientes"
    })
  }
}


export const createPatient = async (req: Request, res: Response) => {
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
        INSERT INTO patients (name, cpf, email, phone, password, rc, status_id)
        VALUES (@name, @cpf, @email, @phone, @password, @rc, @status_id)
      `)

    return res.status(201).json({
      message: "Paciente cadastrado com sucesso"
    })

  } catch (error) {
    console.error("Erro ao criar paciente:", error)

    return res.status(500).json({
      message: "Erro ao criar paciente"
    })
  }
}


export const updatePatient = async (req: Request, res: Response) => {
  const { id } = req.params
  const { name, email, phone } = req.body

  if (!name && !email && !phone) {
    return res.status(400).json({
      message: "Nenhum campo para atualizar"
    })
  }

  try {
    await pool.request()
      .input("id", id)
      .input("name", name)
      .input("email", email)
      .input("phone", phone)
      .query(`
        UPDATE clients
        SET name = COALESCE(@name, name),
            email = COALESCE(@email, email),
            phone = COALESCE(@phone, phone)
        WHERE client_id = @id
      `)

    return res.status(200).json({
      message: "Paciente atualizado com sucesso"
    })

  } catch (error) {
    console.error("Erro ao atualizar paciente:", error)

    return res.status(500).json({
      message: "Erro ao atualizar paciente"
    })
  }
}