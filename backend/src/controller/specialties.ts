import { Request, Response } from "express"
import pool from "../config/database"

export const getSpecialties = async (req: Request, res: Response) => {
  try {
    const response = await pool.request().query("SELECT id, name FROM specialties ORDER BY name")

    return res.status(200).json(response.recordset)

  } catch (error) {
    console.error("Erro ao buscar especialidades:", error)

    return res.status(500).json({
      message: "Erro ao buscar especialidades"
    })
  }
}
