import { Router } from "express"
import { getSpecialties } from "../controller/specialties"

const router = Router()

router.get("/specialties", getSpecialties)

export default router
