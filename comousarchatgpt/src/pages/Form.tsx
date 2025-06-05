import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface FormData {
  service: string;
  strengths: string;
  targetAudience: string;
  results: string;
}

const Form = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    service: '',
    strengths: '',
    targetAudience: '',
    results: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

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

      navigate(`/preview/${data.sessionId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar tu solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center px-8 py-6">
        <button
          onClick={() => navigate(-1)}
          className="text-primary-dark text-base flex items-center hover:underline"
        >
          <span className="mr-2">&larr;</span> Volver
        </button>
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-8 w-8 mr-2" />
          <span className="font-bold text-primary-dark text-lg">ComoUsarChatGPT.cl</span>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="flex flex-1 items-center justify-center">
        <form className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-2xl" onSubmit={handleSubmit}>
          <h1 className="text-4xl font-bold text-center mb-2 text-primary-dark">Cuéntanos sobre tu servicio</h1>
          <p className="text-lg text-center text-gray-600 mb-8">
            Completa estos campos para que podamos generar una propuesta de valor y estructura profesional personalizada para tu servicio.
          </p>

          {/* Question 1 */}
          <div className="mb-6">
            <label className="block font-semibold text-lg mb-1">1. ¿Qué servicio ofreces?</label>
            <span className="block text-gray-500 text-sm mb-2">
              Describe brevemente tu servicio principal y qué haces por tus clientes.
            </span>
            <textarea
              className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-primary-light focus:outline-none"
              rows={3}
              name="service"
              required
              value={formData.service}
              onChange={handleChange}
              placeholder="Ej: Ofrezco consultoría en marketing digital para pequeñas empresas, ayudándolas a crear estrategias de redes sociales que generen más ventas..."
            />
          </div>

          {/* Question 2 */}
          <div className="mb-6">
            <label className="block font-semibold text-lg mb-1">2. ¿Cuáles son tus principales fortalezas?</label>
            <span className="block text-gray-500 text-sm mb-2">
              Menciona tus habilidades, experiencia o conocimientos únicos.
            </span>
            <textarea
              className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-primary-light focus:outline-none"
              rows={3}
              name="strengths"
              required
              value={formData.strengths}
              onChange={handleChange}
              placeholder="Ej: Tengo 5 años de experiencia en marketing, certificaciones en Google Ads, especialización en e-commerce..."
            />
          </div>

          {/* Question 3 */}
          <div className="mb-6">
            <label className="block font-semibold text-lg mb-1">3. ¿Quién es tu cliente ideal?</label>
            <span className="block text-gray-500 text-sm mb-2">
              Describe a tu audiencia objetivo lo más específico posible.
            </span>
            <textarea
              className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-primary-light focus:outline-none"
              rows={3}
              name="targetAudience"
              required
              value={formData.targetAudience}
              onChange={handleChange}
              placeholder="Ej: Dueños de pequeñas empresas de retail, entre 30-50 años, que facturan entre $10M-$50M anuales y quieren digitalizar sus ventas..."
            />
          </div>

          {/* Question 4 */}
          <div className="mb-8">
            <label className="block font-semibold text-lg mb-1">4. ¿Qué resultados entregas?</label>
            <span className="block text-gray-500 text-sm mb-2">
              Especifica los beneficios concretos que obtienen tus clientes.
            </span>
            <textarea
              className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-primary-light focus:outline-none"
              rows={3}
              name="results"
              required
              value={formData.results}
              onChange={handleChange}
              placeholder="Ej: Aumento del 30% en ventas online, reducción del 50% en costo por adquisición de clientes, presencia profesional en redes sociales..."
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm mb-4 text-center">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-lg text-lg flex items-center justify-center transition"
          >
            {loading ? 'Procesando...' : 'Generar mi propuesta de valor'}
            <span className="ml-2">&rarr;</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Form; 