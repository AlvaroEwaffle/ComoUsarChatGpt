import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';

export class MercadoPagoService {
  private client: MercadoPagoConfig;
  private readonly PAYMENT_AMOUNT = 90; // $9.990 CLP

  constructor() {
    const accessToken = process.env.MP_ACCESS_TOKEN;
    if (!accessToken) {
      throw new Error('MP_ACCESS_TOKEN is not set');
    }

    this.client = new MercadoPagoConfig({ accessToken: accessToken });
  }

  async createPayment(sessionId: string): Promise<{ id: string; init_point: string }> {
    try {
      const preference = new Preference(this.client);
      const response = await preference.create({
        body: {
          items: [
            {
              id: sessionId,
              title: "Servicio potenciado con IA",
              unit_price: this.PAYMENT_AMOUNT,
              quantity: 1,
              currency_id: "CLP"
            }
          ],
          back_urls: {
            failure: "https://comousaria.pages.dev/error",
            pending: "https://comousaria.pages.dev/pending",
            success: `https://comousaria.pages.dev/success/${sessionId}`,
          },
          auto_return: 'approved',
          notification_url: "https://comousarchatgpt-production.up.railway.app/api/sessions/webhook",
          metadata: {
            sessionId
          }
        }
      });

      if (!response.id || !response.init_point) {
        throw new Error('Invalid response from Mercado Pago');
      }

      return {
        id: String(response.id),
        init_point: String(response.init_point)
      };
    } catch (error) {
      console.error('Error creating payment:', error);
      throw new Error('Failed to create payment preference');
    }
  }

  async verifyPayment(paymentId: string): Promise<boolean> {
    try {
      const payment = new Payment(this.client);
      const paymentData = await payment.get({ id: paymentId });
      
      return paymentData.status === 'approved';
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw new Error('Failed to verify payment');
    }
  }

  async handlePaymentNotification(paymentId: string): Promise<void> {
    try {
      const isApproved = await this.verifyPayment(paymentId);
      if (!isApproved) {
        throw new Error('Payment not approved');
      }
    } catch (error) {
      console.error('Error handling payment notification:', error);
      throw error;
    }
  }
} 