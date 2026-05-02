import { Router } from "express"
import { getSecretaries, createSecretary, updateSecretary } from "../controller/secretaries"

const router = Router()

router.get("/secretaries", getSecretaries)
router.post("/secretaries", createSecretary)
router.patch("/secretaries/:id", updateSecretary)

export default router