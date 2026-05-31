import { Router } from 'express';
import { login, forgotPassword, verifyResetToken, resetPassword } from '../controller/authController';

const router = Router();

router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-token', verifyResetToken);
router.post('/reset-password', resetPassword);

export default router;