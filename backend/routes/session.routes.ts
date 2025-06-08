import { Router } from 'express'
import {
  createSession,
  getSessionById,
  webhookPago,
  paySession,
  getPremiumResult
} from '../controllers/session.controller'

const router = Router()

router.post('/', createSession)
router.get('/:id', getSessionById)
router.post('/pago', paySession)
router.post('/webhook', webhookPago)
router.get('/:sessionId/premium', getPremiumResult)

export default router
