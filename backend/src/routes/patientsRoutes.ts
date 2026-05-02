import { Router } from "express"
import { getPatients, createPatient, updatePatient } from "../controller/patients"

const router = Router()

router.get("/patients", getPatients)
router.post("/patients", createPatient)
router.patch("/patients/:id", updatePatient)

export default router