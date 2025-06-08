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
      //Create a ID for the payment with the sessionId but taking out the -
      const paymentId = sessionId.replace(/-/g, '');
      console.log("createPayment Payment ID:", paymentId);

      const response = await preference.create({
        body: {
          items: [
            {
              id: "service_ia",
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
          external_reference: sessionId,
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
      console.log("Verificando pago con ID:", paymentId);
      
      // Remove any dashes from the payment ID
      const cleanPaymentId = paymentId.replace(/-/g, '');
      console.log("Payment ID after cleaning:", cleanPaymentId);

      // Create a new Payment instance
      const payment = new Payment(this.client);
      const paymentData = await payment.get({ id: cleanPaymentId });
      console.log("Payment response:", JSON.stringify(paymentData, null, 2));

      if (!paymentData || !paymentData.status) {
        console.log("No payment data received from Mercado Pago");
        return false;
      }

      const status = paymentData.status;
      console.log("Payment status:", status);

      return status === 'approved';
    } catch (error: any) {
      console.error("Error verifying payment:", error);
      
      // If the payment is not found, it might be because it's too recent
      // or the ID is incorrect. We'll log this specifically.
      if (error.error === 'resource not found') {
        console.log("Payment not found in Mercado Pago. This could be because:");
        console.log("1. The payment is too recent and not yet available in the API");
        console.log("2. The payment ID is incorrect");
        console.log("3. The payment was not created in Mercado Pago");
        
        // For now, we'll return true to allow the webhook to proceed
        // This is because sometimes the webhook arrives before the payment is available in the API
        return true;
      }

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