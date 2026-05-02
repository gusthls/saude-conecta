import { Request, Response } from "express"
import pool from "../config/database"


export const getAdmins = async (req: Request, res: Response) => {
  try {
    const response = await pool.request().query("SELECT * FROM admins")

    return res.status(200).json(response.recordset)

  } catch (error) {
    console.error("Erro ao buscar admins:", error)

    return res.status(500).json({
      message: "Erro ao buscar admins"
    })
  }
}

export const createAdmin = async (req: Request, res: Response) => {
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
    console.error("Erro ao criar administrador:", error)

    return res.status(500).json({
      message: "Erro ao criar administrador"
    })
  }
}

export const updateAdmin = async (req: Request, res: Response) => {
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
        UPDATE admins
        SET name = COALESCE(@name, name),
            email = COALESCE(@email, email),
            phone = COALESCE(@phone, phone)
        WHERE admin_id = @id
      `)

    return res.status(200).json({
      message: "Administrador atualizado com sucesso"
    })

  } catch (error) {
    console.error("Erro ao atualizar administrador:", error)

    return res.status(500).json({
      message: "Erro ao atualizar administrador"
    })
  }
}