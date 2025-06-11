import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


interface Props {
    data: any;
}

const PremiumResult: React.FC<Props> = ({ data }) => {
    const { preview, pro } = data;
    const etapas = pro.mapa_servicio.etapas || [];
    const [currentStep, setCurrentStep] = useState(0);
    const etapaActual = etapas[currentStep];

    return (
        <div className="min-h-screen bg-neutral">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 py-10 px-4">
                {/* Vertical Sidebar Menu */}
                <aside className="w-full md:w-64 flex-shrink-0 mb-8 md:mb-0">
                    <nav className="flex flex-col gap-6 bg-white rounded-xl shadow p-6 border border-gray-100 sticky top-4 z-10">
                        <a href="#propuesta" className="block py-4 px-3 rounded-lg hover:bg-primary-light transition">
                            <div className="text-xl font-bold text-primary">🎯 Propuesta de Valor</div>
                            <div className="text-sm text-text-gray">Tu mensaje central y diferencial</div>
                        </a>
                        <a href="#etapas" className="block py-4 px-3 rounded-lg hover:bg-primary-light transition">
                            <div className="text-xl font-bold text-primary">📖 Etapas del Servicio</div>
                            <div className="text-sm text-text-gray">Descubre el paso a paso</div>
                        </a>
                        <a href="#prompts" className="block py-4 px-3 rounded-lg hover:bg-primary-light transition">
                            <div className="text-xl font-bold text-primary">💡 Prompts</div>
                            <div className="text-sm text-text-gray">Ejemplos de uso de IA</div>
                        </a>
                        <a href="#infografia" className="block py-4 px-3 rounded-lg hover:bg-primary-light transition">
                            <div className="text-xl font-bold text-primary">🖼️ Infografía</div>
                            <div className="text-sm text-text-gray">Resumen visual del servicio</div>
                        </a>
                        <a href="#checklist" className="block py-4 px-3 rounded-lg hover:bg-primary-light transition">
                            <div className="text-xl font-bold text-primary">✅ Checklist</div>
                            <div className="text-sm text-text-gray">Control de calidad y mejoras</div>
                        </a>
                        <a href="#landing" className="block py-4 px-3 rounded-lg hover:bg-primary-light transition">
                            <div className="text-xl font-bold text-primary">🌐 Landing Page</div>
                            <div className="text-sm text-text-gray">Tu página personal lista</div>
                        </a>
                    </nav>
                </aside>

                {/* Main Content */}
                <div className="flex-1 space-y-10">
                    {/* PREVIEW (Gratis) */}
                    <section id="propuesta" className="bg-white p-8 rounded-xl shadow-lg">
                        <h1 className="text-4xl font-bold mb-4 text-primary">¡Tu servicio está listo para brillar! 🚀</h1>
                        <h2 className="text-2xl font-semibold mb-6">Ya tienes tu propuesta de valor</h2>
                        <p className="text-lg text-text-gray mb-8 whitespace-pre-line">{preview.propuesta_valor}</p>

                        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            🤖 Cómo potenciarlo con IA
                        </h3>
                        <p className="text-lg text-text-gray mb-6 whitespace-pre-line">{preview.descripcion_potencia_ia}</p>

                        <div className="grid md:grid-cols-2 gap-4">
                            {preview.ideas_IA.map((idea: string, index: number) => (
                                <div key={index} className="bg-primary-light p-4 rounded-lg">
                                    <p className="text-gray-700">{idea}</p>
                                </div>
                            ))}
                        </div>
                    </section>


                    {/* Propuesta de Valor Pro */}
                    <section className="bg-white p-8 rounded-xl shadow-lg">
                        <h3 className="text-2xl font-bold mb-4 text-primary flex items-center gap-2">
                            📌 Así se ve tu propuesta irresistible
                        </h3>
                        <p className="text-lg text-text-gray italic">{pro.propuesta_valor_pro.bio}</p>
                    </section>

                    {/* Infografía Visual */}
                    <section id="infografia" className="mb-8 bg-white p-8 rounded-xl shadow-lg">
                        <h3 className="text-2xl font-bold mb-6 text-primary flex items-center gap-2">
                            🖼️ Visualiza el viaje de tu cliente ideal
                        </h3>
                        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
                            <p className="text-xl font-semibold mb-6 text-gray-900">
                                {pro.infografia.titulo}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {pro.infografia.secciones?.map((sec: string, idx: number) => (
                                    <div
                                        key={idx}
                                        className="bg-primary-light p-6 rounded-lg border-l-4 border-primary shadow-sm"
                                    >
                                        <h4 className="text-lg font-bold text-primary mb-2">{sec}</h4>
                                        <p className="text-sm text-text-gray">
                                            {pro.infografia.contenido?.[idx] || 'Descripción pendiente.'}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {pro.infografia.cta && (
                                <div className="mt-8 flex justify-center">
                                    <button className="bg-primary text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-primary-dark transition text-lg">
                                        {pro.infografia.cta}
                                    </button>
                                </div>
                            )}
                        </div>
                    </section>


                    {/* MINI LIBRO DE ETAPAS */}
                    <section id="etapas" className="max-w-4xl mx-auto min-h-[80vh] max-h-[90vh] p-10 bg-white rounded-2xl shadow-xl flex flex-col justify-between">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-8 flex items-center gap-2">
                                📖 Tu servicio paso a paso
                            </h2>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStep}
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -30 }}
                                    transition={{ duration: 0.4 }}
                                    className="bg-primary-light rounded-xl p-8 shadow-inner border-l-8 border-primary/60 w-full"
                                >
                                    <h3 className="text-2xl md:text-3xl font-bold text-primary mb-4">{etapaActual?.nombre}</h3>
                                    <p className="text-lg md:text-xl italic text-gray-800 mb-6">{etapaActual?.descripcion}</p>
                                    <ul className="space-y-3 text-gray-900 text-base md:text-lg leading-relaxed">
                                        <li><strong>🧑‍🤝‍🧑 Interacción con el cliente:</strong> {etapaActual?.interacciones_usuario}</li>
                                        <li><strong>🎭 Qué ve tu cliente:</strong> {etapaActual?.front_of_stage}</li>
                                        <li><strong>🔧 Lo que ocurre detrás de escena:</strong> {etapaActual?.back_of_stage}</li>
                                        <li><strong>📂 Cómo se organiza tu sistema:</strong> {etapaActual?.procesos_internos}</li>
                                        <li><strong>⚙️ Automatizaciones recomendadas:</strong> {etapaActual?.automatizaciones?.join(', ')}</li>
                                        <li><strong>✨ ¿Qué gana el cliente en esta etapa?:</strong> {etapaActual?.beneficio}</li>
                                        <li><strong>⏱️ Duración sugerida:</strong> {etapaActual?.duracion}</li>
                                        <li><strong>📌 Acción recomendada:</strong> {etapaActual?.cta}</li>
                                    </ul>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <div className="flex items-center justify-between mt-10">
                            <button
                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition"
                                onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
                                disabled={currentStep === 0}
                            >
                                ◀ Anterior
                            </button>
                            <span className="text-primary font-semibold text-sm md:text-base tracking-wide uppercase">
                                ETAPA {currentStep + 1} DE {etapas.length}
                            </span>
                            <button
                                className="px-4 py-2 rounded bg-primary hover:bg-primary-dark text-white font-medium transition"
                                onClick={() => setCurrentStep((prev) => Math.min(prev + 1, etapas.length - 1))}
                                disabled={currentStep === etapas.length - 1}
                            >
                                Siguiente ▶
                            </button>
                        </div>
                    </section>


                    {/* Prompts */}
                    <section id="prompts" className="mb-8 bg-white p-8 rounded-xl shadow-lg">
                        <h3 className="text-2xl font-bold mb-4 text-primary flex items-center gap-2">
                            💡 Ideas y mensajes que puedes usar con IA
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            {Array.isArray(pro.prompt_ejemplo) ? (
                                pro.prompt_ejemplo.map((p: any, index: number) => (
                                    <div key={index} className="bg-primary-light p-6 rounded-lg">
                                        <h4 className="font-semibold text-lg mb-2">{p.etapa}</h4>
                                        <pre className="text-sm text-text-gray bg-white p-4 rounded whitespace-pre-wrap">{p.prompt}</pre>
                                    </div>
                                ))
                            ) : (
                                <div className="text-text-gray">
                                    {typeof pro.prompt_ejemplo === 'string' ? pro.prompt_ejemplo : 'No hay prompts disponibles.'}
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Checklist */}
                    <section id="checklist" className="mb-8 bg-white p-8 rounded-xl shadow-lg">
                        <h3 className="text-2xl font-bold mb-4 text-primary flex items-center gap-2">
                            ✅ ¿Listo para impresionar? Revisa estos puntos clave
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            {pro.checklist_servicio.items.map((item: string, index: number) => (
                                <div key={index} className="bg-primary-light p-4 rounded-lg flex items-center gap-3">
                                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                                    <span className="text-text-gray">{item}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Landing page */}
                    <section id="landing" className="bg-white p-8 rounded-xl shadow-lg">
                        <h3 className="text-2xl font-bold mb-4 text-primary flex items-center gap-2">
                            🌐 Así se verá tu página para captar clientes
                        </h3>
                        <div className="bg-primary-light p-6 rounded-lg">
                            <p className="mb-4"><strong>Propuesta:</strong> {pro.landing_page.contenido.pv_destacada}</p>
                            <p className="mb-4"><strong>Etapas:</strong> {pro.landing_page.contenido.etapas.join(', ')}</p>
                            <p><strong>Testimonio:</strong> {pro.landing_page.contenido.testimonio_destacado}</p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PremiumResult; 