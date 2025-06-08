import mongoose, { Document, Schema } from 'mongoose';

// Sub-schemas for nested objects
const PropuestaValorProSchema = new Schema({
  bio: String,
  imagen_alt: String
});

const EtapaSchema = new Schema({
  nombre: String,
  descripcion: String,
  interacciones_usuario: String,
  front_of_stage: String,
  back_of_stage: String,
  procesos_internos: String,
  automatizaciones: [String],
  beneficio: String,
  duracion: String,
  cta: String
});

const MapaServicioSchema = new Schema({
  titulo_servicio: String,
  etapas: [EtapaSchema]
});

const PromptEjemploSchema = new Schema({
  etapa: String,
  prompt: String
});

const InfografiaSchema = new Schema({
  titulo: String,
  secciones: [String],
  contenido: [String],
  imagen: String,
  cta: String
});

const ChecklistServicioSchema = new Schema({
  titulo: String,
  items: [String],
  formato: String
});

const LandingPageSchema = new Schema({
  url: String,
  contenido: {
    pv_destacada: String,
    etapas: [String],
    testimonio_destacado: String,
    cta: String
  }
});

const ProSchema = new Schema({
  propuesta_valor_pro: PropuestaValorProSchema,
  mapa_servicio: MapaServicioSchema,
  prompt_ejemplo: { type: Schema.Types.Mixed },
  infografia: InfografiaSchema,
  checklist_servicio: ChecklistServicioSchema,
  landing_page: LandingPageSchema
});

export interface ISession extends Document {
  id: string;
  service: string;
  strengths: string;
  targetAudience: string;
  results: string;
  // Preview fields
  propuesta_valor: string;
  descripcion_potencia_ia: string;
  ideas_IA: string[];
  prompt_ejemplo: Array<{
    etapa: string;
    prompt: string;
  }> | string;
  // Pro fields
  pro: {
    propuesta_valor_pro: {
      bio: string;
      imagen_alt: string;
    };
    mapa_servicio: {
      titulo_servicio: string;
      etapas: Array<{
        nombre: string;
        descripcion: string;
        interacciones_usuario: string;
        front_of_stage: string;
        back_of_stage: string;
        procesos_internos: string;
        automatizaciones: string[];
        beneficio: string;
        duracion: string;
        cta: string;
      }>;
    };
    prompt_ejemplo: Array<{
      etapa: string;
      prompt: string;
    }> | string;
    infografia: {
      titulo: string;
      secciones: string[];
      contenido: string[];
      imagen: string;
      cta: string;
    };
    checklist_servicio: {
      titulo: string;
      items: string[];
      formato: string;
    };
    landing_page: {
      url: string;
      contenido: {
        pv_destacada: string;
        etapas: string[];
        testimonio_destacado: string;
        cta: string;
      };
    };
  };
  isPaid: boolean;
  premium_development: boolean;
  createdAt: Date;

}

const sessionSchema = new Schema<ISession>({
  id: { type: String, required: true, unique: true },
  service: { type: String, required: true },
  strengths: { type: String, required: true },
  targetAudience: { type: String, required: true },
  results: { type: String, required: true },
  // Preview fields
  propuesta_valor: { type: String },
  descripcion_potencia_ia: { type: String },
  ideas_IA: [{ type: String }],
  // Pro fields
  pro: {
    propuesta_valor_pro: PropuestaValorProSchema,
    mapa_servicio: MapaServicioSchema,
    prompt_ejemplo: { type: Schema.Types.Mixed },
    infografia: InfografiaSchema,
    checklist_servicio: ChecklistServicioSchema,
    landing_page: LandingPageSchema
  },
  isPaid: { type: Boolean, default: false },
  premium_development: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const Session = mongoose.model<ISession>('Session', sessionSchema); 