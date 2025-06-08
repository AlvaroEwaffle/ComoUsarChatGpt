import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Session } from '../models/session.model';
import { generateSession, generatePremiumSession } from '../services/openai.service';
import { MercadoPagoService } from '../services/mercadoPago.service';
import mongoose from 'mongoose';
import crypto from 'crypto';

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

export const webhookPago = async (req: Request, res: Response) => {
  console.log("=== WEBHOOK RECIBIDO ===");
  console.log("Headers:", JSON.stringify(req.headers, null, 2));
  console.log("Body:", JSON.stringify(req.body, null, 2));
  
  try {
    // Handle test requests from Mercado Pago
    if (Object.keys(req.body).length === 0) {
      console.log("Test webhook received from Mercado Pago - Responding OK");
      return res.status(200).send('OK');
    }

    // Handle test webhook from developer panel
    if (req.body.topic === 'payment' && req.body.dataId) {
      console.log("=== WEBHOOK DE PRUEBA DEL PANEL DE DESARROLLADORES ===");
      const paymentId = req.body.dataId;
      // Convert ID back to UUID format
      const sessionId = paymentId.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5');

      console.log("Payment ID:", paymentId);
      console.log("Session ID (UUID):", sessionId);

      // Update session as paid
      console.log("Buscando sesión en la base de datos...");
      const session = await Session.findOne({ id: sessionId });
      if (!session) {
        console.error(`Session ${sessionId} not found`);
        return res.status(404).json({ error: 'Session not found' });
      }

      console.log("Actualizando sesión como pagada...");
      session.isPaid = true;
      await session.save();
      
      console.log(`Session ${sessionId} marked as paid successfully`);
      return res.status(200).send('OK');
    }

    // Verify webhook signature for production webhooks
    const signatureHeader = req.headers['x-signature'] as string;
    const webhookSecret = process.env.MP_WEBHOOK_SECRETKEY;

    console.log("=== VERIFICACIÓN DE FIRMA ===");
    console.log("Signature header:", signatureHeader);
    console.log("WebhookSecret present:", !!webhookSecret);

    if (!signatureHeader || !webhookSecret) {
      console.error('Missing webhook verification data:', {
        signatureHeader: !!signatureHeader,
        webhookSecret: !!webhookSecret
      });
      return res.status(400).json({ error: 'Invalid webhook request' });
    }

    // Parse signature header (format: ts=timestamp,v1=signature)
    const signatureParts = signatureHeader.split(',');
    const timestampMatch = signatureParts[0].match(/ts=(\d+)/);
    const signatureMatch = signatureParts[1].match(/v1=([a-f0-9]+)/);

    if (!timestampMatch || !signatureMatch) {
      console.error('Invalid signature format:', signatureHeader);
      return res.status(400).json({ error: 'Invalid signature format' });
    }

    const timestamp = timestampMatch[1];
    const signature = signatureMatch[1];

    console.log("Parsed timestamp:", timestamp);
    console.log("Parsed signature:", signature);

    // Create signature verification string
    const payload = JSON.stringify(req.body);
    const verificationString = `${timestamp}.${payload}`;
    
    // Create HMAC
    const hmac = crypto.createHmac('sha256', webhookSecret);
    hmac.update(verificationString);
    const calculatedSignature = hmac.digest('hex');

    console.log("=== COMPARACIÓN DE FIRMAS ===");
    console.log("Verification string:", verificationString);
    console.log("Received signature:", signature);
    console.log("Calculated signature:", calculatedSignature);

    // Compare signatures
    if (signature !== calculatedSignature) {
      console.error('Invalid webhook signature', {
        received: signature,
        calculated: calculatedSignature
      });
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const { type, data } = req.body;
    console.log("=== DATOS DEL PAGO ===");
    console.log("Type:", type);
    console.log("Data:", JSON.stringify(data, null, 2));

    if (type === 'payment') {
      const paymentId = data.id.replace(/-/g, '');
      const sessionId = data.external_reference;

      console.log("=== PROCESANDO PAGO ===");
      console.log("Payment ID:", paymentId);
      console.log("Session ID:", sessionId);

      if (!sessionId) {
        console.error('No external_reference found in payment data');
        return res.status(400).json({ error: 'No session reference found' });
      }

      // Verify payment with Mercado Pago
      console.log("Verificando pago con Mercado Pago...");
      const isApproved = await mercadoPagoService.verifyPayment(paymentId);
      console.log("Pago verificado, aprobado:", isApproved);
      
      if (!isApproved) {
        console.error(`Payment ${paymentId} not approved`);
        return res.status(400).json({ error: 'Payment not approved' });
      }

      // Update session as paid
      console.log("Buscando sesión en la base de datos...");
      const session = await Session.findOne({ id: sessionId });
      if (!session) {
        console.error(`Session ${sessionId} not found`);
        return res.status(404).json({ error: 'Session not found' });
      }

      console.log("Actualizando sesión como pagada...");
      session.isPaid = true;
      await session.save();
      
      console.log(`Session ${sessionId} marked as paid successfully`);
    }

    console.log("=== WEBHOOK PROCESADO EXITOSAMENTE ===");
    res.status(200).send('OK');
  } catch (error) {
    console.error('=== ERROR PROCESANDO WEBHOOK ===');
    console.error('Error details:', error);
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
    // Treat response as an object with id and init_point
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