import OpenAI from 'openai'
import { v4 as uuid } from 'uuid'
import dotenv from 'dotenv'

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

export async function generateSession(input: any) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `
Eres un consultor experto en diseño de servicios, storytelling y estrategia con IA.
Ayudas a emprendedores con mucha experiencia técnica o temática, pero poca claridad sobre cómo presentar, escalar o potenciar su servicio con inteligencia artificial.

Tu objetivo es crear una transformación tangible. 
Tu estilo debe ser inspirador, claro y accionable. 
El output debe generar deseo inmediato de pasar a la versión Pro.

Tu respuesta debe venir en formato JSON. 
NO incluyas explicaciones ni texto fuera del JSON.
        `
        },
        {
          role: 'user',
          content: `
    INPUT DEL USUARIO:
    ${input.servicio}
    
    Por favor, responde usando esta estructura:
    
    {
      "preview": {
      
        "propuesta_valor": "Texto de 3 a 5 líneas claro y persuasivo. Debes explicar al emprendedor como su propuesta de valor es única y destacar la gran oportunidad que tiene depotenciarlo con IA.",
        "descripcion_potencia_ia": "Texto de 5 a 7 líneas claro sobre como potenciar el servicio con IA. Debes explicar al emprendedor como puede usar la IA para potenciar su servicio. Agrega 1 o 2 ejepmlos.",
        "ideas_IA": [
          "Idea concreta 1 de cómo usar IA para potenciar el servicio propuesto, deben ser cosas que el emprendedor pueda hacer en su servicio en 1 o 2 líneas.",
          ...
          "Idea 5-7"
        ]
      },
      "pro": {
        "propuesta_valor_pro": {
                "bio": "Versión ultra poderosa para LinkedIn, pitch o Instagram bio.",
          "imagen_alt": "Texto que acompañará la imagen descargable."
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
        "prompt_ejemplo": [
          {
            "etapa": "Paso 1: Diagnóstico",
            "prompt": "Escribe un prompt de 4-6 párrafos para ChatGPT que permita al experto generar un diagnóstico detallado de su cliente ideal. Incluye: tono esperado, variables a considerar, formato del resultado esperado, y cómo personalizar según el tipo de cliente."

          },
        ],
      }
    }
        `
        }
      ]
    })


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

export async function generateProSession(input: any) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `
    Eres un consultor experto en diseño de servicios para emprendedores. 
    Tu tarea es transformar ideas de servicios en propuestas claras, profesionales y accionables.
    
    Responde siempre en formato JSON estructurado, separando la parte gratuita (preview) de la parte paga (versión pro).
    Usa lenguaje simple, persuasivo y enfocado en el cliente final. Evita tecnicismos.
    
    No incluyas explicaciones, solo responde el JSON solicitado.
        `
        },
        {
          role: 'user',
          content: `
    INPUT DEL USUARIO:
    ${input.servicio}
    
    Por favor, responde usando esta estructura:
    
    {
      "preview": {
        "propuesta_valor": "Texto de 1 a 2 líneas claro y persuasivo.",
        "ideas_IA": [
          "Idea concreta 1 de cómo usar IA para potenciar el servicio.",
          ...
          "Idea 5-7"
        ]
      },
      "pro": {
        "propuesta_valor_pro": {
          "bio": "Versión ideal para bio, pitch o redes.",
          "imagen_alt": "Texto que acompañará la imagen descargable."
        },
        "mapa_servicio": {
          "titulo_servicio": "Nombre atractivo del servicio.",
          "etapas": [
            {
              "nombre": "Paso 1: Diagnóstico",
              "descripcion": "Qué ocurre en esta etapa",
              "beneficio": "Beneficio clave de esta etapa",
              "duracion": "Duración sugerida",
              "cta": "Llamado a la acción sugerido"
            },
            {
              "nombre": "Paso 2: Acompañamiento",
              ...
            },
            {
              "nombre": "Paso 3: Resultado entregable",
              ...
            }
          ]
        },
        "prompts_por_etapa": [
          {
            "etapa": "Paso 1: Diagnóstico",
            "prompt": "Prompt sugerido para pedirle a ChatGPT apoyo en esta etapa."
          },
          ...
        ],
        "testimonio_pro": {
          "cita": "Testimonio breve y potente (si aplica)",
          "html_embed": "<blockquote>...</blockquote>",
          "alt_imagen": "Texto para generar imagen testimonial"
        },
        "mini_pagina_marca": {
          "url": "https://comousarchatgpt.cl/nombre",
          "componentes": [
            "Propuesta de valor",
            "Mapa de servicio",
            "Testimonio",
            "Botón de contacto"
          ]
        }
      }
    }
        `
        }
      ]
    })


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

