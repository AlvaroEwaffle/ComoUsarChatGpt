import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { generateSession } from '../services/openai.service';
import { Session } from '../models/Session';
import mongoose from 'mongoose';
import { MercadoPagoService } from '../services/mercadoPago.service';

// MongoDB connection string (replace with your actual connection string)
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/comousarchatgpt';

// Connect to MongoDB using Mongoose
mongoose.connect(uri)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error: Error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

const mercadoPagoService = new MercadoPagoService();

export const createSession = async (req: Request, res: Response) => {
  try {
    const { service, strengths, targetAudience, results } = req.body;
    
    if (!service || !strengths || !targetAudience || !results) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const sessionId = uuidv4();
    
    // Generate value proposition using OpenAI
    const { valueProp } = await generateSession({
      servicio: service,
      fortalezas: strengths,
      audiencia: targetAudience,
      resultados: results
    });

    // Create session data
    const session = new Session({
      id: sessionId,
      service,
      strengths,
      targetAudience,
      results,
      valueProposition: valueProp,
      isPaid: false,
      createdAt: new Date()
    });

    // Save session to MongoDB
    await session.save();

    res.status(201).json({
      sessionId,
      valueProposition: valueProp
    });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getSessionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const session = await Session.findOne({ id });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // If session is not paid, only return limited information
    if (!session.isPaid) {
      const { valueProposition } = session;
      return res.json({
        valueProposition,
        isPaid: false
      });
    }

    // Return full session data if paid
    res.json(session);
  } catch (error) {
    console.error('Error getting session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const webhookPago = async (req: Request, res: Response) => {
  try {
    const { type, data } = req.body;

    if (type === 'payment') {
      const { id } = data;
      // Here you would verify the payment with Mercado Pago
      // and update the session status accordingly
      
      // For now, we'll just mark it as paid
      await Session.updateOne({ id }, { $set: { isPaid: true } });
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const paySession = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.body;
    const session = await Session.findOne({ id: sessionId });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (session.isPaid) {
      return res.status(400).json({ error: 'Session already paid' });
    }

    const response = await mercadoPagoService.createPayment(sessionId);
    console.log('response', response.id, response.init_point);

    return res.json({
      success: true,
      init_point: response.init_point,
      preference_id: response.id
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 