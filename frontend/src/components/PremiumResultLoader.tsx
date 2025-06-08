import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PremiumResult from './PremiumResult';

// Mock premium data example
const mockPremiumData = {
  sessionId: 'mock',
  preview: {
    propuesta_valor: "Ayudo a adultos mayores a reconectarse con su cuerpo y emociones a través de clases de yoga adaptadas, mejorando su movilidad, bienestar y autoestima.",
    descripcion_potencia_ia: "La IA puede ayudarte a personalizar clases según el estado emocional del alumno, crear rutinas personalizadas y generar contenido educativo automatizado. Por ejemplo, podrías usar ChatGPT para crear una rutina semanal adaptada al nivel de energía del grupo, o para responder dudas frecuentes de tus alumnos.",
    ideas_IA: [
      "Generar rutinas personalizadas según el estado de ánimo o nivel de dolor.",
      "Automatizar respuestas frecuentes para alumnos nuevos.",
      "Crear ebooks con consejos de movilidad y respiración.",
      "Diseñar encuestas automatizadas para conocer el progreso de los alumnos.",
      "Usar IA para adaptar el lenguaje de los materiales a adultos mayores.",
      "Crear listas de música relajante con IA según la clase.",
      "Diseñar emails semanales con tips personalizados para cada alumno."
    ]
  },
  pro: {
    propuesta_valor_pro: {
      bio: "Instructor de yoga para adultos mayores. Clases suaves, adaptadas y reconectadas con el cuerpo y la emoción.",
      imagen_alt: "Imagen de una clase de yoga suave con adultos mayores felices y conectados."
    },
    mapa_servicio: {
      titulo_servicio: "Yoga Consciente para Adultos Mayores",
      etapas: [
        {
          nombre: "Paso 1: Diagnóstico",
          descripcion: "Evaluación inicial física y emocional del alumno para conocer su estado y necesidades.",
          interacciones_usuario: "El alumno responde un formulario online y conversa con el instructor sobre sus objetivos y salud.",
          front_of_stage: "Instructor guía la entrevista y revisa el formulario.",
          back_of_stage: "El sistema IA analiza las respuestas y sugiere focos de atención.",
          procesos_internos: "Configuración del formulario y revisión automática de datos.",
          automatizaciones: [
            "Formulario online con preguntas personalizadas por IA",
            "Informe automático de diagnóstico"
          ],
          beneficio: "Permite adaptar la práctica a las capacidades y expectativas del alumno.",
          duracion: "30 minutos",
          cta: "Completa tu diagnóstico inicial"
        },
        {
          nombre: "Paso 2: Cierre de venta",
          descripcion: "Presentación de una propuesta personalizada y cierre de inscripción.",
          interacciones_usuario: "El alumno recibe una propuesta y puede hacer preguntas antes de inscribirse.",
          front_of_stage: "Instructor presenta la propuesta y resuelve dudas.",
          back_of_stage: "El sistema IA genera la propuesta y prepara el contrato.",
          procesos_internos: "Generación automática de documentos y seguimiento de interesados.",
          automatizaciones: [
            "Propuesta personalizada generada por IA",
            "Email de bienvenida automatizado"
          ],
          beneficio: "Facilita la decisión y reduce el tiempo de inscripción.",
          duracion: "20 minutos",
          cta: "Acepta y reserva tu cupo"
        },
        {
          nombre: "Paso 3: Acompañamiento",
          descripcion: "Clases semanales de yoga adaptadas a las necesidades del grupo.",
          interacciones_usuario: "El alumno asiste a clases, recibe feedback y puede consultar dudas por WhatsApp.",
          front_of_stage: "Instructor dirige la clase y responde consultas.",
          back_of_stage: "El sistema IA sugiere ejercicios y adapta la rutina semanal.",
          procesos_internos: "Monitoreo de asistencia y ajuste de rutinas.",
          automatizaciones: [
            "Recordatorios automáticos de clase",
            "Rutinas semanales sugeridas por IA"
          ],
          beneficio: "Mejora la movilidad, el ánimo y la adherencia al programa.",
          duracion: "1 hora semanal",
          cta: "Únete a la próxima clase"
        },
        {
          nombre: "Paso 4: Seguimiento",
          descripcion: "Evaluación mensual del progreso y ajuste de objetivos.",
          interacciones_usuario: "El alumno recibe un informe de avance y puede agendar una sesión de feedback.",
          front_of_stage: "Instructor revisa el progreso y acuerda nuevos objetivos.",
          back_of_stage: "El sistema IA genera informes y sugiere mejoras.",
          procesos_internos: "Análisis de datos y actualización de planes.",
          automatizaciones: [
            "Informe de progreso automático con gráficos",
            "Sugerencias de mejora generadas por IA"
          ],
          beneficio: "Motiva al alumno y permite un ajuste continuo del servicio.",
          duracion: "15 minutos cada mes",
          cta: "Revisa tu informe y agenda feedback"
        }
      ]
    },
    prompt_ejemplo: [
      {
        etapa: "Paso 1: Diagnóstico",
        prompt: "Actúa como un instructor de yoga especializado en adultos mayores. Crea una lista de preguntas para conocer la condición física, emocional y objetivos de un nuevo alumno. Incluye aspectos físicos, emocionales y de estilo de vida. Presenta las preguntas de forma amable, no invasiva, y fáciles de comprender para una persona mayor de 65 años."
      },
      {
        etapa: "Paso 2: Cierre de venta",
        prompt: "Redacta un email de bienvenida y una propuesta personalizada para un alumno que acaba de completar su diagnóstico. Explica los beneficios de las clases y cómo se adaptarán a sus necesidades."
      },
      {
        etapa: "Paso 3: Acompañamiento",
        prompt: "Diseña una rutina semanal de yoga suave de 3 días para una mujer de 70 años con movilidad reducida en las rodillas. La rutina debe incluir movimientos de bajo impacto, respiración consciente y recomendaciones de posturas seguras. Agrega una introducción para motivarla a seguir el plan."
      },
      {
        etapa: "Paso 4: Seguimiento",
        prompt: "Genera un informe de progreso mensual para un alumno, destacando mejoras en movilidad, bienestar y sugerencias para el próximo mes. Usa un tono motivador y claro."
      }
    ],
    infografia: {
      titulo: "Mapa de Yoga Consciente",
      secciones: ["Diagnóstico", "Cierre de venta", "Acompañamiento", "Seguimiento"],
      contenido: [
        "Evaluación inicial física y emocional del alumno para conocer su estado y necesidades.",
        "Presentación de una propuesta personalizada y cierre de inscripción.",
        "Clases semanales de yoga adaptadas a las necesidades del grupo.",
        "Evaluación mensual del progreso y ajuste de objetivos."
      ],
      imagen: "https://media.istockphoto.com/id/500130316/photo/caucasian-woman-practicing-yoga-at-seashore.jpg?s=612x612&w=0&k=20&c=Zb9EkXhXFHelQJe9sXjTT0wcfOnsYpoo12g0vGACitQ=",
      cta: "Inscríbete a mi servicio de yoga consciente para adultos mayores",
    },
    checklist_servicio: {
      titulo: "Checklist de Calidad para tu Servicio",
      items: [
        "¿Tu propuesta de valor está clara para tus clientes?",
        "¿Cada etapa de tu servicio tiene un propósito y entregable definido?",
        "¿Estás haciendo seguimiento a tus clientes?",
        "¿Puedes automatizar alguna parte sin perder humanidad?",
        "¿Tu comunicación refleja lo que prometes?",
        "¿Recibes feedback de tus alumnos para mejorar continuamente?"
      ],
      formato: "Editable en Notion y Google Docs"
    },
    landing_page: {
      url: "https://comousarchatgpt.cl/teresa",
      contenido: {
        pv_destacada: "Ayudo a adultos mayores a reconectarse con su cuerpo y emociones a través del yoga.",
        etapas: ["Diagnóstico inicial", "Cierre de venta", "Clases suaves", "Seguimiento mensual"],
        testimonio_destacado: "“Desde que empecé las clases, camino con más seguridad y duermo mejor.”",
        cta: "Reserva tu primera clase"
      }
    }
  },
  isPaid: true
};

const PremiumResultLoader = () => {
  const { sessionId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    setLoading(true);
    setError(null);
    if (sessionId === 'mock') {
      setData(mockPremiumData);
      setLoading(false);
      return;
    }
    fetch(`http://localhost:3000/api/sessions/${sessionId}/premium`)
      .then(res => {
        if (!res.ok) throw new Error('No se pudo cargar el resultado premium');
        return res.json();
      })
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [sessionId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-lg">Cargando resultado premium...</div>;
  if (error || !data) return <div className="min-h-screen flex items-center justify-center text-red-600">{error || 'Error al cargar los datos.'}</div>;

  return <PremiumResult data={data} />;
};

export default PremiumResultLoader; 