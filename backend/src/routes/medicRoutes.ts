import { Router } from "express"
import { getMedics, createMedic, updateMedic } from "../controller/medics"

const router = Router()

router.get("/medics", getMedics)
router.post("/medics", createMedic)
router.patch("/medics/:id", updateMedic)

export default router