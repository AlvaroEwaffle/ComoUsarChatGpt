import { useState, useEffect } from "react";
import { ArrowLeft, Lock, Sparkles, Check, Target, Users, TrendingUp, XCircle, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface FormData {
  service: string;
  strengths: string;
  targetAudience: string;
  results: string;
}

interface PreviewContent {
  propuesta_valor: string;
  descripcion_potencia_ia: string;
  ideas_IA: string[];
}

interface ProContent {
  propuesta_valor_pro: {
    bio: string;
    imagen_alt: string;
  };
  mapa_servicio: {
    titulo_servicio: string;
    etapas: {
      nombre: string;
    }[];
  };
  prompt_ejemplo: {
    etapa: string;
    prompt: string;
  }[];
}

interface SessionData {
  sessionId: string;
  preview: PreviewContent;
  pro: ProContent;
  isPaid: boolean;
}

const Preview = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const [formData, setFormData] = useState<FormData | null>(null);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessionData = async () => {
      let data;
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        if (!backendUrl) throw new Error('VITE_BACKEND_URL is not set');
        const response = await fetch(`${backendUrl}/api/sessions/${sessionId}`);
        if (!response.ok) {
          throw new Error('Error al cargar la sesión');
        }
        data = await response.json();

        // Use the new API response structure directly
        const sessionDataObj: SessionData = {
          sessionId: data.sessionId,
          isPaid: data.isPaid,
          preview: data.preview,
          pro: data.pro
        };

        setSessionData(sessionDataObj);
        setFormData(JSON.parse(localStorage.getItem('serviceFormData') || '{}'));
      } catch (error) {
        console.error('Error fetching session:', error);
        toast({
          title: "Error",
          description: "No se pudo cargar la sesión. Por favor, intenta nuevamente.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchSessionData();
    } else {
      setLoading(false);
      navigate('/');
    }
  }, [sessionId, navigate]);

  const handlePayment = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      if (!backendUrl) throw new Error('VITE_BACKEND_URL is not set');
      const response = await fetch(`${backendUrl}/api/sessions/pago`, {
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

      // Redirect to MercadoPago checkout
      window.location.href = data.init_point;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al procesar el pago';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error || !formData || !sessionData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <XCircle className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Error
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            {error || 'No se pudo cargar la sesión'}
          </p>
          <Button
            onClick={() => navigate('/')}
            size="lg"
            className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      {/* ===== Main Content Container ===== */}
      <main className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        <div className="animate-fade-in">


          {/* ===== Page Title Section ===== */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Tu propuesta de valor personalizada
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              ¡Listo! Tu servicio ya tiene una propuesta clara y profesional para destacarte y atraer más clientes, ahora potenciada con IA.
            </p>
          </div>

          {/* ===== Service Overview Cards =====
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              🎯 Tu perfil como experto
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Ya definimos tu audiencia ideal, lo que ofreces y los resultados que generas. Así vas a conectar con más clientes.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Target Audience Card 
              <div className="text-center p-4 bg-white rounded-lg">
                <Users className="w-8 h-8 text-primary-500 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">👥 Público objetivo</h3>
                <p className="text-sm text-gray-600">{formData?.targetAudience}</p>
              </div>

              {/* Service Card 
              <div className="text-center p-4 bg-white rounded-lg">
                <Sparkles className="w-8 h-8 text-primary-500 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">🎤 Servicio ofrecido</h3>
                <p className="text-sm text-gray-600">{formData?.service}</p>
              </div>

              {/* Results Card 
              <div className="text-center p-4 bg-white rounded-lg">
                <TrendingUp className="w-8 h-8 text-primary-500 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">🌟 Resultados que entregas</h3>
                <p className="text-sm text-gray-600">{formData?.results}</p>
              </div>
            </div>
          </div>  */}


          {/* ===== Main Content Card ===== */}
          <Card className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-8">
            {/* ===== Value Proposition Section ===== */}
            <div className="flex items-center space-x-3 mb-6">
              <Target className="w-6 h-6 text-primary-500" />
              <h2 className="text-2xl font-bold text-gray-900">¿Qué es tu propuesta de valor?</h2>
            </div>

            {/* ===== Main Value Proposition ===== */}
            <div className="bg-primary-50 rounded-xl p-6 mb-6">
              <p className="text-lg text-gray-800 leading-relaxed">
                {sessionData?.preview.propuesta_valor}
              </p>
            </div>

            {/* ===== AI Enhancement Description ===== */}
            <div className="bg-blue-50 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                ✨ ¿Y si llevaras tu servicio al siguiente nivel con IA?
              </h3>

              <p className="text-lg text-gray-800 leading-relaxed">
                {sessionData?.preview.descripcion_potencia_ia}
              </p>
            </div>

            {/* ===== AI Ideas List ===== */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                💡 Ideas para potenciar con IA
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {sessionData?.preview.ideas_IA.map((idea, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-start space-x-3">
                      <Sparkles className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{idea}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              🔓 Desbloquea tu servicio profesional con IA
            </h3>
            <div className="border-2 border-primary-200 rounded-xl p-6 mb-8 bg-primary-50">
              <div className="text-center max-w-md mx-auto">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Accede a tu propuesta de valor lista para compartir
                </h3>
                <p className="text-gray-600 mb-6">
                  Prompts listos para usar
                </p>
                <div className="text-3xl font-bold text-primary-500 mb-6">
                  💰 Solo $9.990 CLP
                </div>
                <Button
                  onClick={handlePayment}
                  size="lg"
                  className="bg-yellow-500 hover:bg-primary-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 mb-4"
                >
                  Desbloquear ahora
                </Button>
                <Button
                  onClick={() => navigate('/premium-result/mock')}
                  size="lg"
                  variant="outline"
                  className="border-purple-300 bg-purple-300 text-black-200 font-semibold mb-2"
                >
                  Ver un Ejemplo de lo que obtendrás
                </Button>
                <div className="mt-6 space-y-2 text-sm text-gray-600">
                  <p className="flex items-center justify-center space-x-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Más de 500 profesionales ya han potenciado sus servicios con esta herramienta</span>
                  </p>
                  <p className="flex items-center justify-center space-x-2">
                    <Lock className="w-4 h-4 text-primary-500" />
                    <span>Pago 100% seguro con MercadoPago</span>
                  </p>
                </div>
              </div>
            </div>

            {/* ===== Pro Benefits Section ===== */}
            <div className="bg-gradient-to-br from-primary-50 to-white rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Todo lo que obtienes en la propuesta
              </h3>

              <div className="grid md:grid-cols-2 gap-8">
                {/* ===== Left Column Benefits ===== */}
                <div className="space-y-6">
                  {/* Pro Value Proposition Benefits */}
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                        <Check className="w-5 h-5 text-primary-600" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900">Tu Propuesta de Valor Pro</h4>
                    </div>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-primary-500" />
                        <span>Versión para bio, redes, presentación y pitch</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-primary-500" />
                        <span>Imagen con la PV para compartir</span>
                      </li>
                    </ul>
                  </div>

                  {/* Service Map Benefits */}
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                        <Check className="w-5 h-5 text-primary-600" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900">Tu Mapa de Servicio Paso a Paso</h4>
                    </div>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-primary-500" />
                        <span>Título del servicio</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-primary-500" />
                        <span>Desglose por etapas</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-primary-500" />
                        <span>Beneficio por etapa</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-primary-500" />
                        <span>Duración sugerida y CTA</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-primary-500" />
                        <span>Sugerencias de automatización</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* ===== Right Column Benefits ===== */}
                <div className="space-y-6">
                  {/* Prompts Benefits */}
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                        <Check className="w-5 h-5 text-primary-600" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900">Prompts para cada etapa</h4>
                    </div>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-primary-500" />
                        <span>Prompts personalizados por etapa</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-primary-500" />
                        <span>Ejemplos prácticos de uso</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-primary-500" />
                        <span>Guía de implementación</span>
                      </li>
                    </ul>
                  </div>

                  {/* Testimonial Benefits */}
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                        <Check className="w-5 h-5 text-primary-600" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900">Testimonio Pro</h4>
                    </div>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-primary-500" />
                        <span>Cita destacada</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-primary-500" />
                        <span>Imagen descargable</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-primary-500" />
                        <span>HTML para insertar</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* ===== Pro Content Preview Section ===== */}
            <div className="border-2 border-primary-200 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Vista Previa del Contenido Pro
                </h3>
                <div className="flex items-center space-x-2">
                  <Crown className="w-5 h-5 text-primary-500" />
                  <span className="text-sm font-medium text-primary-600">Premium</span>
                </div>
              </div>

              <div className="space-y-6">
                {/* Pro Value Proposition Preview */}
                <div className="bg-primary-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Propuesta de Valor Pro</h4>
                  <p className="text-gray-700">{sessionData?.pro.propuesta_valor_pro.bio}</p>
                </div>

                {/* Service Map Preview */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Hemos pensado en una estructura de servicio especialmente pensado en tus clientes
                  </h4>
                  <h4 className="text-gray-900 mb-3">
                    Título del servicio: {sessionData?.pro.mapa_servicio.titulo_servicio}
                  </h4>

                  <ul className="space-y-2">
                    {sessionData?.pro.mapa_servicio.etapas.map((etapa, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary-600">{index + 1}</span>
                        </div>
                        <span className="text-gray-700">{etapa.nombre}</span>
                      </li>
                    ))}
                  </ul>
                  <h4 className="font-semibold text-gray-900 mb-3 mt-3">
                    Tenemos el paso a paso de cada etapa del servicio listas para que puedas implementar en tu servicio
                  </h4>
                </div>

                {/* Prompt Example Preview */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Te entregamos prompts para cada etapa del servicio para que saques el máximo provecho de tu servicio, por ejemplo:</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">{sessionData?.pro.prompt_ejemplo[0]?.etapa}</p>
                    <p className="text-gray-700">{sessionData?.pro.prompt_ejemplo[0]?.prompt}</p>
                  </div>
                </div>
              </div>
            </div>


          </Card>

          {/* ===== Payment Section ===== */}
          <Card className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8 md:p-12 relative">
              <div className="text-center max-w-md mx-auto">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Accede a tu propuesta de servicio lista para lanzarla al mercado
                </h3>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  ¿Qué obtendrás?
                </h3>
                <ul className="mb-6 text-left max-w-sm mx-auto space-y-3">
                  <li className="flex items-start space-x-2">
                    <Check className="w-5 h-5 text-green-500 mt-1" />
                    <span>Tu Propuesta de Valor Pro</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Check className="w-5 h-5 text-green-500 mt-1" />
                    <span>Prompts listos para usar</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Check className="w-5 h-5 text-green-500 mt-1" />
                    <span>Tu Mapa de Servicio Paso a Paso</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Check className="w-5 h-5 text-green-500 mt-1" />
                    <span>Una mini landing page para atraer más clientes</span>
                  </li>

                </ul>
                <div className="text-3xl font-bold text-primary-500 mb-6 text-center">
                  💰 Solo $9.990 CLP
                </div>
                <div className="flex flex-col items-center">
                  <Button
                    onClick={handlePayment}
                    size="lg"
                    className="bg-yellow-500 hover:bg-primary-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 mb-4"
                  >
                    Desbloquear ahora
                  </Button>
                  <Button
                    onClick={() => navigate('/premium-result/mock')}
                    size="lg"
                    variant="outline"
                    className="border-purple-300 bg-purple-300 text-black-200 font-semibold mb-2"
                  >
                    Ver un Ejemplo de lo que obtendrás
                  </Button>
                  <div className="w-full max-w-sm">
                    <ul className="text-left space-y-2 text-sm text-gray-600">
                      <li className="flex items-center space-x-2 font-semibold">
                        <span>Pago 100% seguro con MercadoPago</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span>Más de 50 profesionales ya han potenciado sus servicios con esta herramienta</span>
                      </li>

                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Preview;
