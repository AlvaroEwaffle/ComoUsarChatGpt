
import { ArrowRight, Sparkles, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      {/* Header */}
      <header className="w-full py-6 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">ComoUsarChatGPT.cl</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 pt-12 md:pt-20">
        <div className="text-center animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Potencia tu servicio
            <span className="text-primary-500 block">profesional con IA</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Genera una propuesta de valor clara y un mapa de servicio paso a paso. 
            Transforma tu expertise en una estructura profesional que conecte con tus clientes ideales.
          </p>

          <Button 
            onClick={() => navigate('/form')}
            size="lg"
            className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 animate-scale-in"
          >
            Empieza aquí
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {/* Features Section */}
        <div className="mt-24 md:mt-32 grid md:grid-cols-3 gap-8 animate-slide-up">
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

      {/* Footer */}
      <footer className="mt-24 md:mt-32 py-12 text-center text-gray-500">
        <p>&copy; 2024 ComoUsarChatGPT.cl - Todos los derechos reservados</p>
      </footer>
    </div>
  );
};

export default Index;
