import { Request, Response } from "express"
import pool from "../config/database"


export const getSecretaries = async (req: Request, res: Response) => {
  try {
    const response = await pool.request().query("SELECT * FROM secretaries")

    return res.status(200).json(response.recordset)

  } catch (error) {
    console.error("Erro ao buscar secretários:", error)

    return res.status(500).json({
      message: "Erro ao buscar secretários"
    })
  }
}


export const createSecretary = async (req: Request, res: Response) => {
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
}


export const updateSecretary = async (req: Request, res: Response) => {
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
        UPDATE secretaries
        SET name = COALESCE(@name, name),
            email = COALESCE(@email, email),
            phone = COALESCE(@phone, phone)
        WHERE secretary_id = @id
      `)

    return res.status(200).json({
      message: "Secretário atualizado com sucesso"
    })

  } catch (error) {
    console.error("Erro ao atualizar secretário:", error)

    return res.status(500).json({
      message: "Erro ao atualizar secretário"
    })
  }
}