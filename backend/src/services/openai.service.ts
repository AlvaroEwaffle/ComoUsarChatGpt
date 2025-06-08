import OpenAI from 'openai'
import { v4 as uuid } from 'uuid'
import dotenv from 'dotenv'
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions'

// Ensure environment variables are loaded
dotenv.config()

// Debug: Log if API key exists (without exposing the key)
console.log('OpenAI API Key exists:', !!process.env.OPENAI_API_KEY)

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set in environment variables')
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

//Free Preview
export async function generateSession(input: any) {
  console.log("--- generateSession ---")
  try {
    const messages: ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: `Eres un consultor experto en diseño de servicios, storytelling y estrategia con IA. 
        Ayudas a emprendedores con mucha experiencia técnica o temática, pero poca claridad sobre cómo presentar, escalar o potenciar su servicio con inteligencia artificial. 
        Tu objetivo es crear una transformación tangible. 
        Tu estilo debe ser inspirador, claro y accionable. 
        El output debe generar deseo inmediato de pasar a la versión Pro.
        Responde SOLO en JSON ESTRICTAMENTE válido. 
        NO incluyas comas finales (trailing commas) en listas o objetos. NO incluyas explicaciones ni texto fuera del JSON.`
      },
      {
        role: 'user',
        content: `
    INPUT DEL USUARIO:
    ${input.servicio}
    ${input.fortalezas}
    ${input.audiencia}
    ${input.resultados}
    
    Por favor, responde usando esta estructura:
    
    { 
        "propuesta_valor": "Texto de 3 a 5 líneas claro y persuasivo. Debes explicar al emprendedor como su propuesta de valor es única y destacar la gran oportunidad que tiene depotenciarlo con IA.",
        "descripcion_potencia_ia": "Texto de 5 a 7 líneas claro sobre como potenciar el servicio con IA. Debes explicar al emprendedor como puede usar la IA para potenciar su servicio. Agrega 1 o 2 ejepmlos.",
        "ideas_IA": [
          "Idea concreta 1 de cómo usar IA para potenciar el servicio propuesto, deben ser cosas que el emprendedor pueda hacer en su servicio en 1 o 2 líneas.",
          ...
          "Idea 5-7"
        ]
      },
        "mapa_servicio": {
                "titulo_servicio": "Nombre poderoso y comercial para el servicio",
          "etapas": [
            {
              "nombre": "Paso 1: Diagnóstico",
            },
            {
              "nombre": "Paso 2: Decisión de Compra",
            },
            {
              "nombre": "Paso 3: Acompañamiento",
            },
            {
              "nombre": "Paso 4: Resultado entregable",
            }
          ]
        },
        "prompt_ejemplo": 
           "Escribe un prompt de 4-6 párrafos para ChatGPT que permita al experto generar un diagnóstico detallado de su cliente ideal. Incluye: tono esperado, variables a considerar, formato del resultado esperado, y cómo personalizar según el tipo de cliente."
        `
      }
    ]

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
    })

    console.log("--- Response Generated ---")


    return {
      id: uuid(),
      valueProp: response.choices[0].message?.content || '',
      isPaid: false
    }
  } catch (error) {
    console.error('Error in generateSession:', error)
    throw error
  }
}

//Premium Session
export async function generatePremiumSession(input: {
  servicio: string;
  fortalezas: string;
  audiencia: string;
  resultados: string;
  preview: {
    propuesta_valor: string;
    descripcion_potencia_ia: string;
    ideas_IA: string[];
  };
}) {

  console.log("--- generatePremiumSession ---")
  

  // Prompt mejorado
  const messages: ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: `
Eres un consultor experto en diseño de servicios para emprendedores. Recibes la parte gratuita (preview) y debes generar la estructura completa del plan premium. Responde SOLO en JSON válido, SIN texto adicional. 
El campo 'premium' debe contener solo los datos premium, no repitas la parte gratuita. 
No dejes ningún campo vacío ni como objeto vacío. Llena todos los campos con ejemplos realistas y detallados.
La estructura debe ser exactamente la siguiente (rellena todos los campos):
{
  "premium": {
    "propuesta_valor_pro": {
      "bio": "Instructor de yoga para adultos mayores. Clases suaves, adaptadas y reconectadas con el cuerpo y la emoción.",
      "imagen_alt": "Imagen de una clase de yoga suave con adultos mayores felices y conectados."
    },
    "mapa_servicio": {
      "titulo_servicio": "Yoga Consciente para Adultos Mayores",
      "etapas": [
        {
          "nombre": "Paso 1: Diagnóstico",
          "descripcion": "Evaluación inicial física y emocional del alumno para conocer su estado y necesidades.",
          "interacciones_usuario": "El alumno responde un formulario online y conversa con el instructor sobre sus objetivos y salud.",
          "front_of_stage": "Instructor guía la entrevista y revisa el formulario.",
          "back_of_stage": "El sistema IA analiza las respuestas y sugiere focos de atención.",
          "procesos_internos": "Configuración del formulario y revisión automática de datos.",
          "automatizaciones": [
            "Formulario online con preguntas personalizadas por IA",
            "Informe automático de diagnóstico"
          ],
          "beneficio": "Permite adaptar la práctica a las capacidades y expectativas del alumno.",
          "duracion": "30 minutos",
          "cta": "Completa tu diagnóstico inicial"
        },
        {
          "nombre": "Paso 2: Cierre de venta",
          "descripcion": "Presentación de una propuesta personalizada y cierre de inscripción.",
          "interacciones_usuario": "El alumno recibe una propuesta y puede hacer preguntas antes de inscribirse.",
          "front_of_stage": "Instructor presenta la propuesta y resuelve dudas.",
          "back_of_stage": "El sistema IA genera la propuesta y prepara el contrato.",
          "procesos_internos": "Generación automática de documentos y seguimiento de interesados.",
          "automatizaciones": [
            "Propuesta personalizada generada por IA",
            "Email de bienvenida automatizado"
          ],
          "beneficio": "Facilita la decisión y reduce el tiempo de inscripción.",
          "duracion": "20 minutos",
          "cta": "Acepta y reserva tu cupo"
        },
        {
          "nombre": "Paso 3: Acompañamiento",
          "descripcion": "Clases semanales de yoga adaptadas a las necesidades del grupo.",
          "interacciones_usuario": "El alumno asiste a clases, recibe feedback y puede consultar dudas por WhatsApp.",
          "front_of_stage": "Instructor dirige la clase y responde consultas.",
          "back_of_stage": "El sistema IA sugiere ejercicios y adapta la rutina semanal.",
          "procesos_internos": "Monitoreo de asistencia y ajuste de rutinas.",
          "automatizaciones": [
            "Recordatorios automáticos de clase",
            "Rutinas semanales sugeridas por IA"
          ],
          "beneficio": "Mejora la movilidad, el ánimo y la adherencia al programa.",
          "duracion": "1 hora semanal",
          "cta": "Únete a la próxima clase"
        },
        {
          "nombre": "Paso 4: Seguimiento",
          "descripcion": "Evaluación mensual del progreso y ajuste de objetivos.",
          "interacciones_usuario": "El alumno recibe un informe de avance y puede agendar una sesión de feedback.",
          "front_of_stage": "Instructor revisa el progreso y acuerda nuevos objetivos.",
          "back_of_stage": "El sistema IA genera informes y sugiere mejoras.",
          "procesos_internos": "Análisis de datos y actualización de planes.",
          "automatizaciones": [
            "Informe de progreso automático con gráficos",
            "Sugerencias de mejora generadas por IA"
          ],
          "beneficio": "Motiva al alumno y permite un ajuste continuo del servicio.",
          "duracion": "15 minutos cada mes",
          "cta": "Revisa tu informe y agenda feedback"
        }
      ]
    },
    "prompt_ejemplo": [
      {
        "etapa": "Paso 1: Diagnóstico",
        "prompt": "Actúa como un instructor de yoga especializado en adultos mayores. Crea una lista de preguntas para conocer la condición física, emocional y objetivos de un nuevo alumno. Incluye aspectos físicos, emocionales y de estilo de vida. Presenta las preguntas de forma amable, no invasiva, y fáciles de comprender para una persona mayor de 65 años."
      },
      {
        "etapa": "Paso 2: Cierre de venta",
        "prompt": "Redacta un email de bienvenida y una propuesta personalizada para un alumno que acaba de completar su diagnóstico. Explica los beneficios de las clases y cómo se adaptarán a sus necesidades."
      },
      {
        "etapa": "Paso 3: Acompañamiento",
        "prompt": "Diseña una rutina semanal de yoga suave de 3 días para una mujer de 70 años con movilidad reducida en las rodillas. La rutina debe incluir movimientos de bajo impacto, respiración consciente y recomendaciones de posturas seguras. Agrega una introducción para motivarla a seguir el plan."
      },
      {
        "etapa": "Paso 4: Seguimiento",
        "prompt": "Genera un informe de progreso mensual para un alumno, destacando mejoras en movilidad, bienestar y sugerencias para el próximo mes. Usa un tono motivador y claro."
      }
    ],
    "infografia": {
      "titulo": "Mapa de Yoga Consciente",
      "secciones": ["Diagnóstico", "Cierre de venta", "Acompañamiento", "Seguimiento"],
      "contenido": [
        "Evaluación inicial física y emocional del alumno para conocer su estado y necesidades.",
        "Presentación de una propuesta personalizada y cierre de inscripción.",
        "Clases semanales de yoga adaptadas a las necesidades del grupo.",
        "Evaluación mensual del progreso y ajuste de objetivos."
      ],
      "imagen": "https://media.istockphoto.com/id/500130316/photo/caucasian-woman-practicing-yoga-at-seashore.jpg?s=612x612&w=0&k=20&c=Zb9EkXhXFHelQJe9sXjTT0wcfOnsYpoo12g0vGACitQ=",
      "cta": "Inscríbete a mi servicio de yoga consciente para adultos mayores"
    },
    "checklist_servicio": {
      "titulo": "Checklist de Calidad para tu Servicio",
      "items": [
        "¿Tu propuesta de valor está clara para tus clientes?",
        "¿Cada etapa de tu servicio tiene un propósito y entregable definido?",
        "¿Estás haciendo seguimiento a tus clientes?",
        "¿Puedes automatizar alguna parte sin perder humanidad?",
        "¿Tu comunicación refleja lo que prometes?",
        "¿Recibes feedback de tus alumnos para mejorar continuamente?"
      ],
      "formato": "Editable en Notion y Google Docs"
    },
    "landing_page": {
      "url": "https://comousarchatgpt.cl/teresa",
      "contenido": {
        "pv_destacada": "Ayudo a adultos mayores a reconectarse con su cuerpo y emociones a través del yoga.",
        "etapas": ["Diagnóstico inicial", "Cierre de venta", "Clases suaves", "Seguimiento mensual"],
        "testimonio_destacado": "“Desde que empecé las clases, camino con más seguridad y duermo mejor.”",
        "cta": "Reserva tu primera clase"
      }
    }
  }
}
\nIMPORTANTE: prompt_ejemplo debe ser SIEMPRE un array de objetos, nunca un string. Cada campo debe estar completo y realista.`
    },
    {
      role: 'user',
      content: `Aquí está la parte gratuita que ya generamos:\n${JSON.stringify(input.preview, null, 2)}\n\nAhora completa la parte "premium" usando la estructura y ejemplo anterior. No dejes ningún campo vacío ni como objeto vacío. Llena todos los campos con ejemplos realistas y detallados.`
    }
  ];

  const resp = await openai.chat.completions.create({
    model: 'gpt-4',
    messages
  });

  const jsonText = resp.choices[0].message?.content || '{}';
  const data = JSON.parse(jsonText);
  console.log("--- Data Generates---")
  return data.premium;
}

