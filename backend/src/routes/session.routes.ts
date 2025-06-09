import { Router, Request, Response, RequestHandler } from 'express'
import {
  createSession,
  getSessionById,
  webhookPago,
  paySession,
  getPremiumResult,
  getPaymentStatus
} from '../controllers/session.controller'

const router = Router()

router.post('/', createSession as RequestHandler)
router.get('/:id', getSessionById as RequestHandler)
router.post('/pago', paySession as RequestHandler)
router.post('/webhook', webhookPago as RequestHandler)
router.get('/:sessionId/premium', getPremiumResult as RequestHandler)
router.get('/:sessionId/payment-status', getPaymentStatus as RequestHandler)

export default router
