import { Router } from 'express'
import {
  createSession,
  getSessionById,
  webhookPago,
  paySession
} from '../controllers/session.controller'

const router = Router()

router.post('/', createSession)
router.get('/:id', getSessionById)
router.post('/pago', paySession)
router.post('/webhook', webhookPago)

export default router
