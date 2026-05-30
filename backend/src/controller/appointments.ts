import { Request, Response } from "express"
import pool from "../config/database"


// Get appointments (all, or filtered by medicId/patientId)
export const getAppointments = async (req: Request, res: Response) => {
  try {
    const { medicId, patientId } = req.query;

    let query = `
      SELECT
        a.id AS id,
        p.name AS patientName,
        ag.name AS medic,
        sp.name AS specialty,
        CONVERT(VARCHAR(10), a.scheduled_at, 23) AS date,
        CONVERT(VARCHAR(5), a.scheduled_at, 108) AS time,
        CASE
          WHEN a.canceled = 1 THEN 'cancelled'
          WHEN a.completed = 1 THEN 'completed'
          ELSE 'scheduled'
        END AS status,
        a.medic_id,
        a.patient_id
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN agents ag ON a.medic_id = ag.id
      LEFT JOIN specialties sp ON ag.specialty_id = sp.id
    `;

    const request = pool.request();

    if (medicId) {
      query += ` WHERE a.medic_id = @medicId`;
      request.input('medicId', medicId as string);
    } else if (patientId) {
      query += ` WHERE a.patient_id = @patientId`;
      request.input('patientId', patientId as string);
    }

    const response = await request.query(query);

    return res.status(200).json(response.recordset);

  } catch (error) {
    console.error("Erro ao buscar consultas:", error)

    return res.status(500).json({
      message: "Erro ao buscar consultas"
    })
  }
}


export const createAppointment = async (req: Request, res: Response) => {
  const { patient_id, medic_id, scheduled_at, appointment_time } = req.body

  if (!patient_id || !medic_id || (!scheduled_at && !appointment_time)) {
    return res.status(400).json({
      message: "Campos obrigatórios não preenchidos"
    })
  }

  try {
    // Combine date + time if both provided
    let scheduledAtValue = scheduled_at;
    if (scheduled_at && appointment_time) {
      scheduledAtValue = `${scheduled_at}T${appointment_time}`;
    }

    await pool.request()
      .input("patient_id", patient_id)
      .input("medic_id", medic_id)
      .input("scheduled_at", scheduledAtValue)
      .query(`
        INSERT INTO appointments (patient_id, medic_id, scheduled_at)
        VALUES (@patient_id, @medic_id, @scheduled_at)
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
  const { completed, canceled } = req.body

  if (completed === undefined && canceled === undefined) {
    return res.status(400).json({
      message: "Nenhum campo para atualizar"
    })
  }

  try {
    const request = pool.request().input("id", id);

    if (completed !== undefined) request.input("completed", completed ? 1 : 0);
    if (canceled !== undefined) request.input("canceled", canceled ? 1 : 0);

    let setClauses: string[] = [];
    if (completed !== undefined) setClauses.push(`completed = @completed`);
    if (canceled !== undefined) setClauses.push(`canceled = @canceled`);

    const setSql = setClauses.join(', ');

    await request.query(`
      UPDATE appointments
      SET ${setSql}, updated_at = GETDATE()
      WHERE id = @id
    `)

    return res.status(200).json({
      message: "Consulta atualizada com sucesso"
    })

  } catch (error) {
    console.error("Erro ao atualizar consulta:", error)

    return res.status(500).json({
      message: "Erro ao atualizar consulta"
    })
  }
}


// Completed appointments
export const getCompletedAppointments = async (req: Request, res: Response) => {
  try {
    const { medicId, patientId } = req.query;

    let query = `
      SELECT
        a.id AS id,
        p.name AS patientName,
        ag.name AS medic,
        sp.name AS specialty,
        CONVERT(VARCHAR(10), a.scheduled_at, 23) AS date,
        CONVERT(VARCHAR(5), a.scheduled_at, 108) AS time,
        'completed' AS status,
        a.medic_id,
        a.patient_id
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN agents ag ON a.medic_id = ag.id
      LEFT JOIN specialties sp ON ag.specialty_id = sp.id
      WHERE a.completed = 1
    `;

    const request = pool.request();

    if (medicId) {
      query += ` AND a.medic_id = @medicId`;
      request.input('medicId', medicId as string);
    } else if (patientId) {
      query += ` AND a.patient_id = @patientId`;
      request.input('patientId', patientId as string);
    }

    const response = await request.query(query);

    return res.status(200).json(response.recordset);

  } catch (error) {
    console.error("Erro ao buscar consultas concluídas:", error)

    return res.status(500).json({
      message: "Erro ao buscar consultas concluídas"
    })
  }
}

export const createCompletedAppointment = async (req: Request, res: Response) => {
  const { patient_id, medic_id, scheduled_at, appointment_time, notes } = req.body

  if (!patient_id || !medic_id || (!scheduled_at && !appointment_time)) {
    return res.status(400).json({
      message: "Campos obrigatórios não preenchidos"
    })
  }

  try {
    let scheduledAtValue = scheduled_at;
    if (scheduled_at && appointment_time) {
      scheduledAtValue = `${scheduled_at}T${appointment_time}`;
    }

    await pool.request()
      .input("patient_id", patient_id)
      .input("medic_id", medic_id)
      .input("scheduled_at", scheduledAtValue)
      .input("notes", notes)
      .query(`
        INSERT INTO appointments (patient_id, medic_id, scheduled_at, notes, completed, completed_at)
        VALUES (@patient_id, @medic_id, @scheduled_at, @notes, 1, GETDATE())
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
  const { notes, completed } = req.body

  if (notes === undefined && completed === undefined) {
    return res.status(400).json({
      message: "Nenhum campo para atualizar"
    })
  }

  try {
    const request = pool.request().input("id", id);
    if (notes !== undefined) request.input("notes", notes);
    if (completed !== undefined) request.input("completed", completed ? 1 : 0);

    const setParts: string[] = [];
    if (notes !== undefined) setParts.push("notes = COALESCE(@notes, notes)");
    if (completed !== undefined) setParts.push("completed = @completed", "completed_at = CASE WHEN @completed = 1 THEN GETDATE() ELSE completed_at END");

    const setSql = setParts.join(', ');

    await request.query(`
      UPDATE appointments
      SET ${setSql}, updated_at = GETDATE()
      WHERE id = @id
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