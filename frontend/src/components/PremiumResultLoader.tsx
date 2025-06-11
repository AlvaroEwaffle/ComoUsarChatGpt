import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PremiumResult from './PremiumResult';

// Mock premium data example
const mockPremiumData = {
  sessionId: 'demo',
  preview: {
    propuesta_valor: "🔍 Este es un ejemplo de propuesta de valor generada con IA. Imagina que enseñas yoga a adultos mayores:\n\nAyudo a adultos mayores a reconectarse con su cuerpo y emociones a través de clases de yoga adaptadas, mejorando su movilidad, bienestar y autoestima.",
    descripcion_potencia_ia: "La IA puede ayudarte a personalizar clases según el estado emocional del alumno, crear rutinas automatizadas y generar contenidos educativos para fortalecer tu servicio. Por ejemplo, podrías usar ChatGPT para crear una rutina semanal adaptada al nivel de energía del grupo o responder dudas frecuentes de forma empática.",
    ideas_IA: [
      "✔️ Generar rutinas personalizadas según el estado emocional.",
      "✔️ Automatizar respuestas frecuentes para alumnos nuevos.",
      "✔️ Crear ebooks con consejos de movilidad y respiración.",
      "✔️ Diseñar encuestas automatizadas para conocer el progreso.",
      "✔️ Adaptar el lenguaje de los materiales a adultos mayores.",
      "✔️ Crear listas de música relajante según la clase.",
      "✔️ Enviar tips semanales personalizados vía email o WhatsApp."
    ]
  },
  pro: {
    propuesta_valor_pro: {
      bio: "Esta sería una versión breve y efectiva para usar en tu bio: \n\n Instructor de yoga para adultos mayores. Clases suaves, adaptadas y reconectadas con el cuerpo y la emoción.",
      imagen_alt: "🎨 Imagen referencial: clase de yoga suave con adultos mayores sonrientes y conectados."
    },
    mapa_servicio: {
      titulo_servicio: "Ejemplo de servicio estructurado: Yoga Consciente para Adultos Mayores",
      etapas: [
        {
          nombre: "Paso 1: Diagnóstico",
          descripcion: "📋 Evaluación inicial del alumno para entender sus necesidades físicas y emocionales.",
          interacciones_usuario: "El alumno responde un formulario online y conversa con el instructor.",
          front_of_stage: "Instructor guía la entrevista y adapta el enfoque.",
          back_of_stage: "IA analiza respuestas y sugiere focos personalizados.",
          procesos_internos: "Configuración de formularios y revisión automatizada.",
          automatizaciones: [
            "✔️ Formulario personalizado generado por IA",
            "✔️ Informe automático de diagnóstico"
          ],
          beneficio: "Permite personalizar la experiencia desde el inicio.",
          duracion: "30 minutos",
          cta: "Completa tu diagnóstico inicial"
        },
        {
          nombre: "Paso 2: Cierre de venta",
          descripcion: "🧾 Se presenta una propuesta personalizada y se confirma la inscripción.",
          interacciones_usuario: "El alumno recibe una propuesta clara y puede hacer preguntas.",
          front_of_stage: "Instructor resuelve dudas y cierra la inscripción.",
          back_of_stage: "IA genera contrato y materiales de bienvenida.",
          procesos_internos: "Seguimiento y automatización de flujos de conversión.",
          automatizaciones: [
            "✔️ Propuesta generada por IA",
            "✔️ Email de bienvenida automatizado"
          ],
          beneficio: "Simplifica la inscripción y profesionaliza el servicio.",
          duracion: "20 minutos",
          cta: "Reserva tu cupo"
        },
        {
          nombre: "Paso 3: Acompañamiento",
          descripcion: "🧘 Clases semanales adaptadas con seguimiento personalizado.",
          interacciones_usuario: "El alumno asiste, recibe feedback y puede consultar dudas.",
          front_of_stage: "Instructor lidera clases y responde consultas.",
          back_of_stage: "IA propone ajustes semanales según feedback.",
          procesos_internos: "Monitoreo, ajuste y documentación continua.",
          automatizaciones: [
            "✔️ Recordatorios automáticos de clase",
            "✔️ Rutinas ajustadas con IA"
          ],
          beneficio: "Mejora adherencia y evolución del alumno.",
          duracion: "1 hora semanal",
          cta: "Únete a la próxima clase"
        },
        {
          nombre: "Paso 4: Seguimiento",
          descripcion: "📈 Evaluación mensual del progreso con ajustes sugeridos.",
          interacciones_usuario: "El alumno recibe un informe y puede agendar feedback.",
          front_of_stage: "Instructor revisa avances y ajusta el plan.",
          back_of_stage: "IA genera informes visuales y sugerencias automáticas.",
          procesos_internos: "Análisis de datos y planificación del siguiente ciclo.",
          automatizaciones: [
            "✔️ Informe de progreso con gráficos",
            "✔️ Sugerencias automáticas de mejora"
          ],
          beneficio: "Refuerza el compromiso y permite mejorar continuamente.",
          duracion: "15 minutos al mes",
          cta: "Agenda tu sesión de seguimiento"
        }
      ]
    },
    prompt_ejemplo: [
      {
        etapa: "Paso 1: Diagnóstico",
        prompt: "🧠 Este es un ejemplo de prompt que podrías usar con ChatGPT:\n\n“Actúa como un instructor de yoga especializado en adultos mayores. Crea una lista de preguntas para conocer la condición física, emocional y los objetivos de un nuevo alumno. Sé claro, amable y no invasivo.”"
      },
      {
        etapa: "Paso 2: Propuesta ",
        prompt: "✉️ Prompt sugerido:\n\n“Redacta un email de bienvenida y una propuesta clara para un nuevo alumno que acaba de completar su diagnóstico. Destaca los beneficios de las clases adaptadas a sus necesidades.”"
      },
      {
        etapa: "Paso 3: Acompañamiento",
        prompt: "🧘 Prompt para rutinas:\n\n“Diseña una rutina semanal de yoga suave para una mujer de 70 años con movilidad reducida. Incluye ejercicios, respiración y consejos de motivación.”"
      },
      {
        etapa: "Paso 4: Seguimiento",
        prompt: "📊 Prompt para informe:\n\n“Genera un informe mensual de progreso en movilidad, bienestar y recomendaciones para el próximo mes. Usa un tono positivo y claro.”"
      }
    ],
    infografia: {
      titulo: "🖼️ Mapa de Yoga Consciente",
      secciones: ["Diagnóstico", "Propuesta", "Acompañamiento", "Seguimiento"],
      contenido: [
        "👤 Evaluación del alumno con apoyo de IA.",
        "💼 Presentación de propuesta y bienvenida.",
        "🧘 Clases personalizadas y acompañamiento continuo.",
        "📈 Informe mensual y ajustes automatizados."
      ],
      imagen: "https://media.istockphoto.com/id/500130316/photo/caucasian-woman-practicing-yoga-at-seashore.jpg",
      cta: "🔄 Este es un ejemplo de visual que podrías entregar a tus clientes."
    },
    checklist_servicio: {
      titulo: "✅ Checklist de Calidad (Ejemplo generado)",
      items: [
        "¿Tu propuesta de valor está clara?",
        "¿Cada etapa tiene objetivos y entregables?",
        "¿Haces seguimiento continuo?",
        "¿Automatizas tareas sin perder el toque humano?",
        "¿Tu comunicación refleja tu promesa?",
        "¿Recoges feedback de tus clientes?"
      ],
      formato: "📄 Editable en Notion o Google Docs"
    },
    landing_page: {
      url: "https://aceleraia.cl/ejemplo-yoga",
      contenido: {
        pv_destacada: "🌟 Propuesta de valor ejemplo: Ayudo a adultos mayores a reconectarse con su cuerpo a través del yoga.",
        etapas: ["Diagnóstico", "Cierre", "Clases", "Seguimiento"],
        testimonio_destacado: "“Desde que empecé las clases, camino con más seguridad y duermo mejor.”",
        cta: "💬 Así se vería tu página si activas AceleraIA"
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
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    if (!backendUrl) throw new Error('VITE_BACKEND_URL is not set');
    fetch(`${backendUrl}/api/sessions/${sessionId}/premium`)
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