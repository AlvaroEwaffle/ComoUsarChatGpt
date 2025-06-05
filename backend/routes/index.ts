import { Router } from 'express';
import { SessionController } from '../controllers/session.controller';
import { PagoController } from '../controllers/pago.controller';

const router = Router();
const sessionController = new SessionController();
const pagoController = new PagoController();

// Session routes
router.post('/sessions', sessionController.createSession);
router.get('/sessions/:id', sessionController.getSession);

// Payment routes
router.post('/pago', pagoController.createPayment);
router.post('/webhook', pagoController.handleWebhook);

export default router; 