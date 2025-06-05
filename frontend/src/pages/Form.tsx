import { useState } from "react";
import { ArrowLeft, ArrowRight, Sparkles, Zap, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";



const Form = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    service: "",
    strengths: "",
    targetAudience: "",
    results: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate form
    if (!formData.service || !formData.strengths || !formData.targetAudience || !formData.results) {
      toast({
        title: "Faltan campos por completar",
        description: "Por favor completa todos los campos para continuar.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    // Store form data in localStorage
    localStorage.setItem('serviceFormData', JSON.stringify(formData));

    try {
      const response = await fetch('http://localhost:3000/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear la sesión');
      }

      // Navigate to preview with session ID
      navigate(`/preview/${data.sessionId}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al procesar tu solicitud';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 pt-12 md:pt-20">
        <div className="text-center animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Descrube como potenciar
            <span className="text-primary-500 block">tu servicio profesional con IA</span>
          </h1>
        </div>

        {/* Features Section */}
        <div className="mt-24 md:mt-16 grid md:grid-cols-3 gap-8 animate-slide-up">
          <div className="text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300">
            <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Target className="w-8 h-8 text-primary-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Propuesta de Valor Clara</h3>
            <p className="text-gray-600">
              Define exactamente qué haces, para quién lo haces y por qué eres la mejor opción.
            </p>
          </div>

          <div className="text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300">
            <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Zap className="w-8 h-8 text-primary-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Estructura Profesional</h3>
            <p className="text-gray-600">
              Obtén un mapa completo de tu servicio con pasos claros y metodología probada.
            </p>
          </div>

          <div className="text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300">
            <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-primary-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Potenciado por IA</h3>
            <p className="text-gray-600">
              Prompts personalizados y estrategias específicas para tu tipo de servicio.
            </p>
          </div>
        </div>
      </main>

      <main className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        <div className="animate-fade-in">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Empieza a aquí gratis
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Completa estos campos para que podamos generar una propuesta de valor
              y estructura profesional personalizada para tu servicio.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 md:p-12 space-y-8">
            <div className="space-y-4">
              <label className="block text-lg font-semibold text-gray-900">
                1. ¿Qué servicio ofreces?
              </label>
              <p className="text-gray-600 text-sm">
                Describe brevemente tu servicio principal y qué haces por tus clientes.
              </p>
              <Textarea
                value={formData.service}
                onChange={(e) => handleInputChange('service', e.target.value)}
                placeholder="Ej: Ofrezco consultoría en marketing digital para pequeñas empresas, ayudándolas a crear estrategias de redes sociales que generen más ventas..."
                className="min-h-[120px] text-base"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-lg font-semibold text-gray-900">
                2. ¿Cuáles son tus principales fortalezas?
              </label>
              <p className="text-gray-600 text-sm">
                Menciona tus habilidades, experiencia o conocimientos únicos.
              </p>
              <Textarea
                value={formData.strengths}
                onChange={(e) => handleInputChange('strengths', e.target.value)}
                placeholder="Ej: Tengo 5 años de experiencia en marketing, certificaciones en Google Ads, especialización en e-commerce..."
                className="min-h-[120px] text-base"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-lg font-semibold text-gray-900">
                3. ¿Quién es tu cliente ideal?
              </label>
              <p className="text-gray-600 text-sm">
                Describe a tu audiencia objetivo lo más específico posible.
              </p>
              <Textarea
                value={formData.targetAudience}
                onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                placeholder="Ej: Dueños de pequeñas empresas de retail, entre 30-50 años, que facturan entre $10M-$50M anuales y quieren digitalizar sus ventas..."
                className="min-h-[120px] text-base"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-lg font-semibold text-gray-900">
                4. ¿Qué resultados entregas?
              </label>
              <p className="text-gray-600 text-sm">
                Especifica los beneficios concretos que obtienen tus clientes.
              </p>
              <Textarea
                value={formData.results}
                onChange={(e) => handleInputChange('results', e.target.value)}
                placeholder="Ej: Aumento del 30% en ventas online, reducción del 50% en costo por adquisición de clientes, presencia profesional en redes sociales..."
                className="min-h-[120px] text-base"
              />
            </div>

            <div className="pt-8">
              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {loading ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Generando...
                  </>
                ) : (
                  <>
                    Generar mi propuesta de valor
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Form;
