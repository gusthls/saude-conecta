import { Request, Response } from "express"
import pool from "../config/database"


//Scheduled appointments
export const getAppointments = async (req: Request, res: Response) => {
  try {
    const response = await pool.request().query("SELECT * FROM scheduled_appointments")

    return res.status(200).json(response.recordset)

  } catch (error) {
    console.error("Erro ao buscar consultas:", error)

    return res.status(500).json({
      message: "Erro ao buscar consultas"
    })
  }
}


export const createAppointment = async (req: Request, res: Response) => {
  const { client_id, medic_id, appointment_date, appointment_time, status_id } = req.body

  if (!client_id || !medic_id || !appointment_date || !appointment_time || !status_id) {
    return res.status(400).json({
      message: "Campos obrigatórios não preenchidos"
    })
  }

  try {
    await pool.request()
      .input("client_id", client_id)
      .input("medic_id", medic_id)
      .input("appointment_date", appointment_date)
      .input("appointment_time", appointment_time)
      .input("status_id", status_id)
      .query(`
        INSERT INTO scheduled_appointments 
        (client_id, medic_id, appointment_date, appointment_time, status_id)
        VALUES 
        (@client_id, @medic_id, @appointment_date, @appointment_time, @status_id)
      `)

    return res.status(201).json({
      message: "Consulta agendada com sucesso"
    })

  } catch (error) {
    console.error("Erro ao agendar consulta:", error)

    return res.status(500).json({
      message: "Erro ao agendar consulta"
    })
  }
}


export const updateAppointment = async (req: Request, res: Response) => {
  const { id } = req.params
  const { status_id } = req.body

  if (!status_id) {
    return res.status(400).json({
      message: "Status não informado"
    })
  }

  try {
    await pool.request()
      .input("id", id)
      .input("status_id", status_id)
      .query(`
        UPDATE scheduled_appointments
        SET status_id = @status_id
        WHERE appointment_id = @id
      `)

    return res.status(200).json({
      message: "Status da consulta atualizado com sucesso"
    })

  } catch (error) {
    console.error("Erro ao atualizar consulta:", error)

    return res.status(500).json({
      message: "Erro ao atualizar consulta"
    })
  }
}


//Completed appointments
export const getCompletedAppointments = async (req: Request, res: Response) => {
  try {
    const response = await pool.request().query("SELECT * FROM completed_appointments")

    return res.status(200).json(response.recordset)

  } catch (error) {
    console.error("Erro ao buscar consultas concluídas:", error)

    return res.status(500).json({
      message: "Erro ao buscar consultas concluídas"
    })
  }
}

export const createCompletedAppointment = async (req: Request, res: Response) => {
  const { client_id, medic_id, appointment_date, appointment_time, notes, status_id } = req.body

  if (!client_id || !medic_id || !appointment_date || !appointment_time || !status_id) {
    return res.status(400).json({
      message: "Campos obrigatórios não preenchidos"
    })
  }

  try {
    await pool.request()
      .input("client_id", client_id)
      .input("medic_id", medic_id)
      .input("appointment_date", appointment_date)
      .input("appointment_time", appointment_time)
      .input("notes", notes)
      .input("status_id", status_id)
      .query(`
        INSERT INTO completed_appointments
        (client_id, medic_id, appointment_date, appointment_time, notes, status_id)
        VALUES
        (@client_id, @medic_id, @appointment_date, @appointment_time, @notes, @status_id)
      `)

    return res.status(201).json({
      message: "Consulta concluída registrada com sucesso"
    })

  } catch (error) {
    console.error("Erro ao criar consulta concluída:", error)

    return res.status(500).json({
      message: "Erro ao criar consulta concluída"
    })
  }
}

export const updateCompletedAppointment = async (req: Request, res: Response) => {
  const { id } = req.params
  const { notes, status_id } = req.body

  if (!notes && !status_id) {
    return res.status(400).json({
      message: "Nenhum campo para atualizar"
    })
  }

  try {
    await pool.request()
      .input("id", id)
      .input("notes", notes)
      .input("status_id", status_id)
      .query(`
        UPDATE completed_appointments
        SET notes = COALESCE(@notes, notes),
            status_id = COALESCE(@status_id, status_id)
        WHERE appointment_id = @id
      `)

    return res.status(200).json({
      message: "Consulta concluída atualizada com sucesso"
    })

  } catch (error) {
    console.error("Erro ao atualizar consulta concluída:", error)

    return res.status(500).json({
      message: "Erro ao atualizar consulta concluída"
    })
  }
}