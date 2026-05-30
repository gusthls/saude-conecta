import { Request, Response } from "express"
import pool from "../config/database"


export const getMedics = async (req: Request, res: Response) => {
  try {
    const response = await pool.request().query("SELECT * FROM agents WHERE agent_type = 'medic'")

    return res.status(200).json(response.recordset)

  } catch (error) {
    console.error("Erro ao buscar médicos:", error)

    return res.status(500).json({
      message: "Erro ao buscar médicos"
    })
  }
}


export const createMedic = async (req: Request, res: Response) => {
  const { name, cpf, email, phone, password, rm, specialty_id, status_id } = req.body

  if (!name || !cpf || !email || !password || !rm || !specialty_id || !status_id) {
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
      .input("specialty_id", specialty_id)
      .input("status_id", status_id)
      .query(`
        INSERT INTO agents (name, cpf, email, phone, password, agent_type, status_id)
        VALUES (@name, @cpf, @email, @phone, @password, 'medic', @status_id)
      `)

    return res.status(201).json({
      message: "Médico cadastrado com sucesso"
    })

  } catch (error) {
    console.error("Erro ao criar médico:", error)

    return res.status(500).json({
      message: "Erro ao criar médico"
    })
  }
}


export const updateMedic = async (req: Request, res: Response) => {
  const { id } = req.params
  const { name, email, phone, specialty_id } = req.body

  if (!name && !email && !phone && !specialty_id) {
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
      .input("specialty_id", specialty_id)
      .query(`
        UPDATE agents
        SET name = COALESCE(@name, name),
            email = COALESCE(@email, email),
            phone = COALESCE(@phone, phone),
            specialty_id = COALESCE(@specialty_id, specialty_id)
        WHERE id = @id
      `)

    return res.status(200).json({
      message: "Médico atualizado com sucesso"
    })

  } catch (error) {
    console.error("Erro ao atualizar médico:", error)

    return res.status(500).json({
      message: "Erro ao atualizar médico"
    })
  }
}