import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Session } from '../models/session.model';
import { generateSession, generatePremiumSession } from '../services/openai.service';
import { MercadoPagoService } from '../services/mercadoPago.service';
import mongoose from 'mongoose';
import crypto from 'crypto';
import { Payment } from 'mercadopago';

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


    // Remove trailing commas before parsing
    let safeValueProp = valueProp.replace(/,\s*([}\]])/g, '$1');
    let parsed;
    try {
      parsed = JSON.parse(safeValueProp);
    } catch (e) {
      console.error('Error parsing OpenAI response:', e, safeValueProp);
      return res.status(500).json({ error: 'Invalid response from OpenAI' });
    }



    // Create session data using the new schema
    const session = new Session({
      id: sessionId,
      service,
      strengths,
      targetAudience,
      results,
      propuesta_valor: parsed.propuesta_valor || '',
      descripcion_potencia_ia: parsed.descripcion_potencia_ia || '',
      ideas_IA: parsed.ideas_IA || [],
      pro: {
        propuesta_valor_pro: parsed.propuesta_valor_pro || {},
        mapa_servicio: parsed.mapa_servicio || {},
        prompt_ejemplo: parsed.prompt_ejemplo || [],
        infografia: parsed.infografia || {},
        checklist_servicio: parsed.checklist_servicio || {},
        landing_page: parsed.landing_page || {},
      },
      isPaid: false,
      premium_development: false,
      createdAt: new Date()
    });

    // Save session to MongoDB
    await session.save();

    res.status(201).json({
      sessionId,
      preview: {
        propuesta_valor: parsed.propuesta_valor || '',
        descripcion_potencia_ia: parsed.descripcion_potencia_ia || '',
        ideas_IA: parsed.ideas_IA || []
      },
      pro: {
        propuesta_valor_pro: parsed.propuesta_valor_pro || {},
        mapa_servicio: parsed.mapa_servicio || {},
        prompt_ejemplo: parsed.prompt_ejemplo || [],
        infografia: parsed.infografia || {},
        checklist_servicio: parsed.checklist_servicio || {},
        landing_page: parsed.landing_page || {},
      },
      isPaid: false
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

    // Always return the new structured format
    res.json({
      sessionId: session.id,
      preview: {
        propuesta_valor: session.propuesta_valor,
        descripcion_potencia_ia: session.descripcion_potencia_ia,
        ideas_IA: session.ideas_IA
      },
      pro: session.pro,
      isPaid: session.isPaid
    });
  } catch (error) {
    console.error('Error getting session:', error);
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
    // Guardar el paymentId en la sesión
    session.paymentId = response.id;
    await session.save();
    // Treat response as an object with id and init_point
    return res.json({
      success: true,
      init_point: response.init_point,
      preference_id: response.id
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ error: 'Error creating payment' });
  }
};

export const getPremiumResult = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const session = await Session.findOne({ id: sessionId });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Only allow if paid
    if (!session.isPaid) {
      return res.status(403).json({ error: 'Session not paid' });
    }

    // If already generated, return it
    if (session.premium_development) {
      return res.json({
        sessionId: session.id,
        preview: {
          propuesta_valor: session.propuesta_valor,
          descripcion_potencia_ia: session.descripcion_potencia_ia,
          ideas_IA: session.ideas_IA
        },
        pro: session.pro,
        isPaid: session.isPaid
      });
    }

    // Generate premium result using structured preview fields
    const premiumData = await generatePremiumSession({
      servicio: session.service,
      fortalezas: session.strengths,
      audiencia: session.targetAudience,
      resultados: session.results,
      preview: {
        propuesta_valor: session.propuesta_valor,
        descripcion_potencia_ia: session.descripcion_potencia_ia,
        ideas_IA: session.ideas_IA
      }
    });

    // Save premium data in session.pro
    session.pro = premiumData;
    session.premium_development = true;
    await session.save();

    res.json({
      sessionId: session.id,
      preview: {
        propuesta_valor: session.propuesta_valor,
        descripcion_potencia_ia: session.descripcion_potencia_ia,
        ideas_IA: session.ideas_IA
      },
      pro: session.pro,
      isPaid: session.isPaid
    });
  } catch (error) {
    console.error('Error getting premium result:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPaymentStatus = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    console.log(`[getPaymentStatus] Checking status for sessionId: ${sessionId}`);
    const session = await Session.findOne({ id: sessionId });

    if (!session) {
      console.log(`[getPaymentStatus] Session not found: ${sessionId}`);
      res.status(404).json({ error: 'Session not found' });
      return;
    }

    // Si la sesión ya está pagada, retorna inmediatamente
    if (session.isPaid) {
      console.log(`[getPaymentStatus] Session already marked as paid: ${sessionId}`);
      res.json({ status: 'paid' });
      return;
    }

    // Si no está pagada, consulta Mercado Pago
    if (!session.paymentId) {
      console.log(`[getPaymentStatus] No paymentId found for session: ${sessionId}`);
      res.json({ status: 'pending' });
      return;
    }

    console.log(`[getPaymentStatus] Verifying payment with Mercado Pago. paymentId: ${session.paymentId}`);
    const isPaid = await mercadoPagoService.verifyPayment(session.paymentId);
    console.log(`[getPaymentStatus] Payment status: ${isPaid}`);
    if (isPaid) {
      console.log(`[getPaymentStatus] Payment approved for session: ${sessionId}. Updating session as paid.`);
      session.isPaid = true;
      await session.save();
      res.json({ status: 'paid' });
      return;
    } else {
      console.log(`[getPaymentStatus] Payment not approved for session: ${sessionId}. Returning pending.`);
      res.json({ status: 'pending' });
      return;
    }
  } catch (error) {
    console.error('[getPaymentStatus] Error getting payment status:', error);
    res.status(500).json({ error: 'Error getting payment status' });
    return;
  }
}

export const webhookPago = async (req: Request, res: Response) => {
  console.log("=== WEBHOOK RECIBIDO ===");
  console.log("Headers:", JSON.stringify(req.headers, null, 2));
  console.log("Body:", JSON.stringify(req.body, null, 2));

  try {
    // Obtenemos el cuerpo de la petición que incluye información sobre la notificación
    const body: { data: { id: string } } = req.body;
    console.log("Body:", body);
    console.log("Body data:", body.data);
    console.log("Body data id:", body.data.id);

    // Obtenemos el pago
    const isPaid = await mercadoPagoService.verifyPayment(body.data.id);
    console.log("isPaid:", isPaid);

    // Process payment
    console.log("=== PROCESANDO PAGO ===");
    console.log("Payment type:", req.body.type);
    console.log("Payment data:", JSON.stringify(req.body.data, null, 2));

    try {
      // Get payment ID from either external_reference or id
      const paymentId = req.body.data?.external_reference || req.body.data?.id;
      if (!paymentId) {
        console.error("No payment ID found in request");
        return res.status(400).json({ error: 'No payment ID found' });
      }

      // Convert ID to UUID format if it doesn't have dashes
      const sessionId = paymentId.includes('-') ? paymentId :
        paymentId.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5');

      console.log("Payment ID:", paymentId);
      console.log("Session ID (UUID):", sessionId);

      // Verify payment with Mercado Pago
      console.log("Verificando pago con Mercado Pago...");
      const payment = await mercadoPagoService.verifyPayment(paymentId);
      console.log("Payment status:", payment);

      if (payment !== true) {
        console.log("Payment not approved");
        return res.status(200).send('OK');
      }

      // Update session
      console.log("Buscando sesión en la base de datos...");
      let session = null;
      if (sessionId) {
        session = await Session.findOne({ id: sessionId });
      }
      if (!session && paymentId) {
        session = await Session.findOne({ paymentId });
      }
      if (!session) {
        console.error(`Session ${sessionId || paymentId} not found`);
        return res.status(404).json({ error: 'Session not found' });
      }

      console.log("Actualizando sesión como pagada...");
      session.isPaid = true;
      await session.save();

      console.log(`Session ${sessionId} marked as paid successfully`);
      return res.status(200).send('OK');
    } catch (error) {
      console.error("Error processing payment:", error);
      return res.status(500).json({ error: 'Error processing payment' });
    }
  } catch (error) {
    console.error('=== ERROR PROCESANDO WEBHOOK ===');
    console.error('Error details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
