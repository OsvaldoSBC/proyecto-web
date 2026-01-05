import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { Calendar, User, ChevronLeft, ExternalLink, Trophy, FileText } from 'lucide-react'

function NoticiaDetalle() {
  const { id } = useParams()
  const [nota, setNota] = useState(null)

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/noticias/${id}/`)
      .then(res => setNota(res.data))
      .catch(err => console.error(err))
  }, [id])

  if (!nota) return <div className="text-white text-center py-20">Cargando...</div>

  const formatearFecha = (fechaString) => {
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(fechaString).toLocaleDateString('es-MX', opciones)
  }

  const esResultado = nota.tipo === 'RESULTADO'

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-20">
      
      <Link to="/noticias" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
        <ChevronLeft size={20} /> Volver a Noticias
      </Link>

      <article className="bg-[#1E1E1E] rounded-3xl overflow-hidden border border-gray-800 shadow-2xl">
        
        {nota.imagen_url && (
            <div className="h-[300px] md:h-[400px] w-full relative group">
                <img src={nota.imagen_url} alt={nota.titulo} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E1E] via-black/40 to-transparent"></div>
                
                <div className="absolute bottom-0 left-0 p-8 w-full">
                    <div className="flex gap-2 mb-3">
                        {nota.nombre_categoria && (
                            <span className="bg-[#E10600] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
                                <Trophy size={12}/> {nota.nombre_categoria}
                            </span>
                        )}
                        {esResultado && (
                            <span className="bg-white text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
                                <FileText size={12}/> Resultados Oficiales
                            </span>
                        )}
                    </div>

                    <h1 className="text-3xl md:text-5xl font-black italic text-white uppercase leading-none drop-shadow-lg">
                        {nota.titulo}
                    </h1>
                </div>
            </div>
        )}

        <div className="p-8">

            {esResultado ? (
                <div className="space-y-8">
                    
                    {nota.link_resultado && (
                        <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 flex flex-col md:flex-row items-center justify-between gap-4">
                             <div>
                                <h3 className="text-white font-bold text-lg">Documento Oficial</h3>
                                <p className="text-gray-400 text-sm">Visualiza los tiempos completos o descarga el PDF original.</p>
                             </div>
                             <a 
                                href={nota.link_resultado} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="bg-[#E10600] hover:bg-red-700 text-white px-6 py-3 rounded-full font-bold uppercase tracking-widest text-xs transition-all shadow-lg flex items-center gap-2 whitespace-nowrap"
                             >
                                <ExternalLink size={16}/> Abrir Fuente Original
                             </a>
                        </div>
                    )}

                    {nota.link_resultado && (
                        <div className="border border-gray-700 rounded-xl overflow-hidden bg-white h-[800px] w-full shadow-2xl relative">
                            <div className="absolute top-0 w-full bg-gray-100 text-gray-500 text-[10px] text-center p-1 z-10 border-b">
                                Vista Previa Integrada
                            </div>
                            <iframe 
                                src={nota.link_resultado} 
                                className="w-full h-full pt-6"
                                title="Resultados"
                                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                            ></iframe>
                        </div>
                    )}
                </div>
            ) : (
                <div className="prose prose-invert max-w-none">
                    {nota.resumen && (
                        <p className="text-xl text-gray-300 font-medium leading-relaxed mb-6 border-l-4 border-[#E10600] pl-4 italic">
                            {nota.resumen}
                        </p>
                    )}
                    <div className="text-gray-400 whitespace-pre-line leading-relaxed text-lg">
                        {nota.contenido}
                    </div>
                </div>
            )}

            <div className="mt-12 pt-6 border-t border-gray-800 flex items-center justify-between text-gray-500 text-sm font-mono">
                <div className="flex items-center gap-2">
                    <Calendar size={14} /> 
                    {formatearFecha(nota.fecha)}
                </div>
                {nota.nombre_equipo && (
                    <div className="flex items-center gap-2">
                        <User size={14} /> {nota.nombre_equipo}
                    </div>
                )}
            </div>

        </div>
      </article>
    </div>
  )
}

export default NoticiaDetalle
