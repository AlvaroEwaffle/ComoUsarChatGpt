import { MercadoPagoConfig, Preference } from 'mercadopago';

export class MercadoPagoService {
  private client: MercadoPagoConfig;

  constructor() {
    const accessToken = process.env.MP_ACCESS_TOKEN;
    if (!accessToken) {
      throw new Error('MP_ACCESS_TOKEN is not set');
    }

    this.client = new MercadoPagoConfig({ accessToken: accessToken });
  }

  async createPayment(sessionId: string): Promise<string> {
    try {
      const preference = new Preference(this.client);
      const response = await preference.create({
        body: {
          items: [
            {
              id: 'id',
              title: "Servicio potenciado con IA",
              unit_price: 100,
              quantity: 1
            }
          ],
          back_urls: {
            failure: "http://localhost:5173/error",
            pending: "http://localhost:5173/pending",
            success: `http://localhost:5173/success/${sessionId}`,
          },
          //auto_return: 'approved',
          metadata: {
            sessionId
          }
        }
      })
      console.log('--------------------------------');
      console.log('response', response);

      return response;

    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  }

  async handlePaymentNotification(paymentId: string): Promise<void> {
    try {
      // Here you would typically:
      // 1. Verify the payment status with Mercado Pago
      // 2. Update the session in the database to mark it as paid
      // 3. Send any necessary notifications
      console.log(`Payment ${paymentId} processed`);
    } catch (error) {
      console.error('Error handling payment notification:', error);
      throw error;
    }
  }
} 