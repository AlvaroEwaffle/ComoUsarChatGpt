import React from 'react';
import { Check } from 'lucide-react';

interface Props {
    data: any;
}

const PremiumResult: React.FC<Props> = ({ data }) => {
    const { preview, pro } = data;
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
                        <a href="#mapa" className="block py-4 px-3 rounded-lg hover:bg-primary-light transition">
                            <div className="text-xl font-bold text-primary">🗺️ Mapa de Servicio</div>
                            <div className="text-sm text-text-gray">Etapas y experiencia del cliente</div>
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
                        <h1 className="text-4xl font-bold mb-4 text-primary">¡Felicidades! 🎉</h1>
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

                    {/* PREMIUM */}
                    <section className="bg-white p-8 rounded-xl shadow-lg">
                        <h1 className="text-4xl font-bold mb-4 text-primary">Entregables Premium</h1>
                        <h2 className="text-2xl font-semibold mb-8">Ahora puedes potenciar tu servicio con IA</h2>

                        {/* Propuesta de Valor Pro */}
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold mb-4 text-primary flex items-center gap-2">
                                📌 Propuesta de Valor Pro
                            </h3>
                            <p className="text-lg text-text-gray italic">{pro.propuesta_valor_pro.bio}</p>
                        </div>

                        {/* Mapa de Servicio */}
                        <div id="mapa" className="mb-8">
                            <h3 className="text-2xl font-bold mb-4 text-primary flex items-center gap-2">
                                🗺️ Mapa de Servicio
                            </h3>
                            <p className="text-xl font-semibold mb-6">{pro.mapa_servicio.titulo_servicio}</p>
                            <div className="overflow-x-auto">
                                <table className="w-full border rounded-lg text-sm">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-3 text-left font-semibold bg-primary text-white">Etapa</th>
                                            {pro.mapa_servicio.etapas?.map((etapa: any, idx: number) => (
                                                <th key={idx} className="px-4 py-3 text-center font-semibold bg-primary text-white">
                                                    {etapa.nombre}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* Descripción row */}
                                        <tr>
                                            <td className="px-4 py-3 font-semibold whitespace-nowrap whitespace-normal break-words">Descripción</td>
                                            {pro.mapa_servicio.etapas ? pro.mapa_servicio.etapas.map((etapa: any, idx: number) => (
                                                <td key={idx} className="px-4 py-3 text-gray-700 whitespace-normal break-words">{etapa.descripcion}</td>
                                            )) : <td className="px-4 py-3 text-gray-700">No disponible</td>}
                                        </tr>
                                        {/* Interacciones Usuario row */}
                                        <tr>
                                            <td className="px-4 py-3 font-semibold whitespace-nowrap whitespace-normal break-words">Interacciones Usuario</td>
                                            {pro.mapa_servicio.etapas ? pro.mapa_servicio.etapas.map((etapa: any, idx: number) => (
                                                <td key={idx} className="px-4 py-3 text-gray-700 whitespace-normal break-words">{etapa.interacciones_usuario}</td>
                                            )) : <td className="px-4 py-3 text-gray-700">No disponible</td>}
                                        </tr>
                                        {/* Front of Stage row */}
                                        <tr>
                                            <td className="px-4 py-3 font-semibold whitespace-nowrap whitespace-normal break-words">Front of Stage</td>
                                            {pro.mapa_servicio.etapas ? pro.mapa_servicio.etapas.map((etapa: any, idx: number) => (
                                                <td key={idx} className="px-4 py-3 text-gray-700 whitespace-normal break-words">{etapa.front_of_stage}</td>
                                            )) : <td className="px-4 py-3 text-gray-700">No disponible</td>}
                                        </tr>
                                        {/* Back of Stage row */}
                                        <tr>
                                            <td className="px-4 py-3 font-semibold whitespace-nowrap whitespace-normal break-words">Back of Stage</td>
                                            {pro.mapa_servicio.etapas ? pro.mapa_servicio.etapas.map((etapa: any, idx: number) => (
                                                <td key={idx} className="px-4 py-3 text-gray-700 whitespace-normal break-words">{etapa.back_of_stage}</td>
                                            )) : <td className="px-4 py-3 text-gray-700">No disponible</td>}
                                        </tr>
                                        {/* Procesos Internos row */}
                                        <tr>
                                            <td className="px-4 py-3 font-semibold whitespace-nowrap whitespace-normal break-words">Procesos Internos</td>
                                            {pro.mapa_servicio.etapas ? pro.mapa_servicio.etapas.map((etapa: any, idx: number) => (
                                                <td key={idx} className="px-4 py-3 text-gray-700 whitespace-normal break-words">{etapa.procesos_internos}</td>
                                            )) : <td className="px-4 py-3 text-gray-700">No disponible</td>}
                                        </tr>
                                        {/* Automatizaciones row */}
                                        <tr>
                                            <td className="px-4 py-3 font-semibold whitespace-nowrap whitespace-normal break-words">Automatizaciones</td>
                                            {pro.mapa_servicio.etapas ? pro.mapa_servicio.etapas.map((etapa: any, idx: number) => (
                                                <td key={idx} className="px-4 py-3 text-gray-700 whitespace-normal break-words">
                                                    {etapa.automatizaciones && etapa.automatizaciones.length > 0 ? (
                                                        <ul className="list-disc list-inside">
                                                            {etapa.automatizaciones.map((auto: string, i: number) => (
                                                                <li key={i}>{auto}</li>
                                                            ))}
                                                        </ul>
                                                    ) : ''}
                                                </td>
                                            )) : <td className="px-4 py-3 text-gray-700">No disponible</td>}
                                        </tr>
                                        {/* Beneficio row */}
                                        <tr>
                                            <td className="px-4 py-3 font-semibold whitespace-nowrap whitespace-normal break-words">Beneficio</td>
                                            {pro.mapa_servicio.etapas ? pro.mapa_servicio.etapas.map((etapa: any, idx: number) => (
                                                <td key={idx} className="px-4 py-3 text-gray-700 whitespace-normal break-words">{etapa.beneficio}</td>
                                            )) : <td className="px-4 py-3 text-gray-700">No disponible</td>}
                                        </tr>
                                        {/* Duración row */}
                                        <tr>
                                            <td className="px-4 py-3 font-semibold whitespace-nowrap whitespace-normal break-words">Duración</td>
                                            {pro.mapa_servicio.etapas ? pro.mapa_servicio.etapas.map((etapa: any, idx: number) => (
                                                <td key={idx} className="px-4 py-3 text-gray-700 whitespace-normal break-words">{etapa.duracion}</td>
                                            )) : <td className="px-4 py-3 text-gray-700">No disponible</td>}
                                        </tr>
                                        {/* CTA row */}
                                        <tr>
                                            <td className="px-4 py-3 font-semibold whitespace-nowrap whitespace-normal break-words">CTA</td>
                                            {pro.mapa_servicio.etapas ? pro.mapa_servicio.etapas.map((etapa: any, idx: number) => (
                                                <td key={idx} className="px-4 py-3 text-gray-700 whitespace-normal break-words">{etapa.cta}</td>
                                            )) : <td className="px-4 py-3 text-gray-700">No disponible</td>}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Prompts */}
                        <div id="prompts" className="mb-8">
                            <h3 className="text-2xl font-bold mb-4 text-primary flex items-center gap-2">
                                💡 Prompts por etapa
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
                        </div>

                        {/* Infografía Visual */}
                        <div id="infografia" className="mb-8">
                            <h3 className="text-2xl font-bold mb-6 text-primary flex items-center gap-2">
                                🖼️ Infografía del Servicio
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
                        </div>

                        {/* Checklist */}
                        <div id="checklist" className="mb-8">
                            <h3 className="text-2xl font-bold mb-4 text-primary flex items-center gap-2">
                                ✅ Checklist de Calidad
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                {pro.checklist_servicio.items.map((item: string, index: number) => (
                                    <div key={index} className="bg-primary-light p-4 rounded-lg flex items-center gap-3">
                                        <Check className="w-5 h-5 text-primary flex-shrink-0" />
                                        <span className="text-text-gray">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Landing page */}
                        <div id="landing">
                            <h3 className="text-2xl font-bold mb-4 text-primary flex items-center gap-2">
                                🌐 Página Personal
                            </h3>
                            <div className="bg-primary-light p-6 rounded-lg">
                                <p className="mb-4"><strong>Propuesta:</strong> {pro.landing_page.contenido.pv_destacada}</p>
                                <p className="mb-4"><strong>Etapas:</strong> {pro.landing_page.contenido.etapas.join(', ')}</p>
                                <p><strong>Testimonio:</strong> {pro.landing_page.contenido.testimonio_destacado}</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PremiumResult; 