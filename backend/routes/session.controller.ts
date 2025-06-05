import { Request, Response } from 'express'
import { generateSession } from '../services/openai.service'
import { saveSession, getSession } from '../utils/firestore'

export const createSession = async (req: Request, res: Response) => {
  const session = await generateSession(req.body)
  await saveSession(session)
  res.json(session)
}

export const getSessionById = async (req: Request, res: Response) => {
  const session = await getSession(req.params.id)
  res.json(session)
}

export const webhookPago = async (req: Request, res: Response) => {
  // Validación de pago con MercadoPago
  res.sendStatus(200)
}
