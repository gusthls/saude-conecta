import { Router } from "express"
import { 
  getAppointments, 
  createAppointment, 
  updateAppointment,
  getCompletedAppointments, 
  createCompletedAppointment, 
  updateCompletedAppointment 
} from "../controller/appointments"

const router = Router()

//Scheduled appointments
router.get("/appointments", getAppointments)
router.post("/appointments", createAppointment)
router.patch("/appointments/:id", updateAppointment)

//Completed appointments
router.get("/appointments/completed", getCompletedAppointments)
router.post("/appointments/completed", createCompletedAppointment)
router.patch("/appointments/completed/:id", updateCompletedAppointment)

export default router