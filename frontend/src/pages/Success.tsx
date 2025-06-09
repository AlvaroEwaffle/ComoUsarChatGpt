import { CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

const Success = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams();

  useEffect(() => {
    // Mark payment as completed
    localStorage.setItem('paymentCompleted', 'true');

    // Consultar el estado del pago
    if (sessionId) {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      if (!backendUrl) {
        console.error('VITE_BACKEND_URL is not set');
        return;
      }
      fetch(`${backendUrl}/api/sessions/${sessionId}/payment-status`)
        .then(res => res.json())
        .then(data => {
          console.log('[Success] Payment status result:', data);
        })
        .catch(err => {
          console.error('[Success] Error fetching payment status:', err);
        });
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-4 animate-scale-in">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          ¡Pago exitoso!
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Tu pago ha sido procesado correctamente. Ya puedes acceder al contenido completo 
          de tu estructura profesional personalizada.
        </p>
        
        <Button 
          onClick={() => navigate('/preview')}
          size="lg"
          className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 mb-6"
        >
          Ver mi contenido
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
        
        <div className="flex items-center justify-center space-x-2 text-gray-500">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm">ComoUsarChatGPT.cl</span>
        </div>
      </div>
    </div>
  );
};

export default Success;
