import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Success = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to preview page after a short delay
    const timer = setTimeout(() => {
      navigate(`/preview/${sessionId}`);
    }, 3000);

    return () => clearTimeout(timer);
  }, [sessionId, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          ¡Pago exitoso!
        </h2>
        <p className="text-gray-600 mb-4">
          Redirigiendo a tu contenido...
        </p>
      </div>
    </div>
  );
};

export default Success; 