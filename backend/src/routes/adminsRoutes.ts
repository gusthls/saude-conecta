import { Router } from "express"
import { getAdmins, createAdmin, updateAdmin } from "../controller/admins"

const router = Router()

router.get("/admins", getAdmins)        
router.post("/admins", createAdmin)     
router.patch("/admins/:id", updateAdmin) 

export default router