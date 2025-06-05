import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MercadoPagoWallet from '../components/MercadoPagoWallet';

interface PreviewData {
  valueProposition: string;
  isPaid: boolean;
}

const Preview = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<PreviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/sessions/${sessionId}`);
        const sessionData = await response.json();
        

        if (!response.ok) {
          throw new Error(sessionData.error || 'Error al cargar la sesión');
        }

        setData(sessionData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar la sesión');
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  const handlePayment = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/sessions/pago', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al procesar el pago');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar el pago');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Tu propuesta de valor generada
          </h2>
          <p className="text-gray-700 whitespace-pre-line">
            {data.valueProposition}
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ideas para potenciar tu servicio con IA
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Crear una lista de preguntas para diagnosticar las necesidades específicas de tus clientes.</li>
            <li>Desarrollar un sistema de seguimiento personalizado para cada cliente.</li>
            <li>Generar contenido educativo adaptado a diferentes niveles de experiencia.</li>
            <li>Crear plantillas de comunicación para mantener el contacto con tus clientes.</li>
            <li>Desarrollar un sistema de retroalimentación para mejorar continuamente tu servicio.</li>
          </ul>
        </div>

        {!data.isPaid && (
          <div className="bg-white shadow rounded-lg p-6 mb-8 relative">
            <div className="absolute inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-4">
                  Estructura profesional de tu servicio
                </h3>
                <p className="text-white mb-6">
                  Desbloquea el mapa completo de tu servicio y los prompts para cada etapa
                </p>
                {data.isPaid ? (
                  <button
                    onClick={handlePayment}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                  >
                    Ya estás desbloqueado
                  </button>
                ) : (
                  <div className="w-full max-w-md mx-auto">
                    <MercadoPagoWallet />
                  </div>
                )}
              </div>
            </div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        )}

        {data.isPaid && (
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Estructura profesional de tu servicio
            </h2>
            <div className="prose max-w-none">
              <h3>1. Diagnóstico Inicial</h3>
              <p>Prompt: "Analiza las necesidades específicas del cliente basándote en su industria, tamaño y objetivos."</p>
              
              <h3>2. Personalización del Servicio</h3>
              <p>Prompt: "Genera un plan personalizado que incluya las herramientas y metodologías más adecuadas."</p>
              
              <h3>3. Implementación</h3>
              <p>Prompt: "Crea un cronograma detallado con hitos y entregables para cada fase del proyecto."</p>
              
              <h3>4. Seguimiento y Ajustes</h3>
              <p>Prompt: "Desarrolla un sistema de métricas y KPIs para medir el progreso y éxito del servicio."</p>
              
              <h3>5. Optimización Continua</h3>
              <p>Prompt: "Identifica áreas de mejora y genera recomendaciones para optimizar el servicio."</p>
            </div>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-800"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default Preview; 