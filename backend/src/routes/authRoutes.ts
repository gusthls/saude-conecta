import { Router } from 'express';
import { login, forgotPassword } from '../controller/authController';

const router = Router();

router.post('/login', login);
router.post('/forgot-password', forgotPassword);

export default router;