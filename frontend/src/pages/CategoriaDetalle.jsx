import { useEffect, useState, useContext } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import AuthContext from '../context/AuthContext'
import { 
  ChevronLeft, Globe, Facebook, Instagram, Twitter, Youtube, 
  Bell, BellOff, ExternalLink, FileText, Flag, Calendar, Activity, Archive,
  ShieldCheck, PlayCircle, Tv 
} from 'lucide-react'

// Función auxiliar para sacar el ID de un link de YouTube
const getYoutubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

function CategoriaDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, authTokens } = useContext(AuthContext)
  
  const [cat, setCat] = useState(null)
  const [resultados, setResultados] = useState([]) 
  const [suscrito, setSuscrito] = useState(false)
  const [cargandoSuscripcion, setCargandoSuscripcion] = useState(false)

  // Carga de información
  useEffect(() => {
    // Info Categoría
    axios.get(`http://127.0.0.1:8000/api/categorias/${id}/`)
      .then(res => setCat(res.data))
      .catch(err => console.error(err))

    // Resultados
    axios.get('http://127.0.0.1:8000/api/noticias/')
      .then(res => {
          const notasDeEstaCat = res.data.filter(n => 
              n.categoria == id && n.tipo === 'RESULTADO'
          )
          setResultados(notasDeEstaCat)
      })
  }, [id])

  // Verificación de suscripción
  useEffect(() => {
    if (user && authTokens) {
      axios.get('http://127.0.0.1:8000/api/mi-perfil/', {
        headers: { 'Authorization': `Bearer ${authTokens.access}` }
      })
      .then(res => {
        if (res.data.suscripciones.includes(Number(id))) setSuscrito(true)
      })
      .catch(error => {
        console.warn("Sesión expirada o inválida al verificar suscripción.");
      })
    }
  }, [id, user, authTokens])

  // Acción de suscribirse
  const handleSuscripcion = async () => {
    if (!user) { alert("Inicia sesión primero"); navigate('/login'); return }
    setCargandoSuscripcion(true)
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/suscribirse/${id}/`, {}, 
        { headers: { 'Authorization': `Bearer ${authTokens.access}` } }
      )
      setSuscrito(response.data.suscrito)
    } catch (error) { 
        console.error(error);
        if(error.response && error.response.status === 401) {
            alert("Tu sesión ha caducado. Por favor inicia sesión de nuevo.");
            navigate('/login');
        }
    }
    setCargandoSuscripcion(false)
  }

  if (!cat) return <div className="text-white text-center py-20">Cargando...</div>

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* BOTÓN VOLVER */}
      <Link to="/categorias" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors">
        <ChevronLeft size={20} /> Volver
      </Link>

      {/* --- HERO SECTION --- */}
      <div className="relative h-[500px] rounded-3xl overflow-hidden border border-gray-800 shadow-2xl group">
        <img src={cat.foto_url} alt={cat.nombre} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-black/40 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 p-8 w-full">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                
                {/* INFO IZQUIERDA */}
                <div className="space-y-4">
                     <div>
                        {cat.activa ? (
                            <div className="inline-flex items-center gap-2 bg-[#00FF00]/10 border border-[#00FF00]/50 text-[#00FF00] px-3 py-1 rounded text-xs font-bold uppercase tracking-wider mb-2 animate-pulse-slow backdrop-blur-md shadow-[0_0_10px_rgba(0,255,0,0.2)]">
                                <Activity size={14} className="animate-pulse" /> Serie Activa
                            </div>
                        ) : (
                            <div className="inline-flex items-center gap-2 bg-red-900/40 border border-red-700 text-red-200 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider mb-2 backdrop-blur-md">
                                <Archive size={14} /> Serie Descontinuada
                            </div>
                        )}

                        <h1 className="text-5xl md:text-7xl font-black italic text-white uppercase tracking-tighter drop-shadow-lg leading-none">
                            {cat.nombre}
                        </h1>
                     </div>

                     {/* REDES SOCIALES CATEGORÍA */}
                     <div className="flex items-center gap-3">
                        {cat.web_oficial && <a href={cat.web_oficial} target="_blank" rel="noreferrer" className="bg-white/10 hover:bg-white hover:text-black text-white p-2 rounded-full backdrop-blur-md transition-all border border-white/20"><Globe size={20} /></a>}
                        {cat.org_facebook && <a href={cat.org_facebook} target="_blank" rel="noreferrer" className="bg-white/10 hover:bg-[#1877F2] text-white p-2 rounded-full backdrop-blur-md transition-all border border-white/20"><Facebook size={20} /></a>}
                        {cat.org_instagram && <a href={cat.org_instagram} target="_blank" rel="noreferrer" className="bg-white/10 hover:bg-[#E4405F] text-white p-2 rounded-full backdrop-blur-md transition-all border border-white/20"><Instagram size={20} /></a>}
                        {cat.org_twitter && <a href={cat.org_twitter} target="_blank" rel="noreferrer" className="bg-white/10 hover:bg-[#1DA1F2] text-white p-2 rounded-full backdrop-blur-md transition-all border border-white/20"><Twitter size={20} /></a>}
                        {cat.org_youtube && <a href={cat.org_youtube} target="_blank" rel="noreferrer" className="bg-white/10 hover:bg-[#FF0000] text-white p-2 rounded-full backdrop-blur-md transition-all border border-white/20"><Youtube size={20} /></a>}
                     </div>
                </div>

                {/* BOTÓN SUSCRIBIRSE */}
                <button 
                    onClick={handleSuscripcion} 
                    disabled={cargandoSuscripcion} 
                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold uppercase tracking-widest text-xs transition-all shadow-lg mb-2 ${
                        suscrito 
                        ? "bg-white text-black hover:bg-gray-200 border border-transparent" 
                        : "bg-[#E10600] text-white hover:bg-red-700 border border-transparent"
                    }`}
                >
                    {cargandoSuscripcion ? "..." : suscrito ? <><BellOff size={16}/> Dejar de Seguir</> : <><Bell size={16}/> Seguir Categoría</>}
                </button>
            </div>
        </div>
      </div>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* IZQUIERDA */}
        <div className="lg:col-span-2 space-y-10">
            
            {/* 1. Descripción */}
            <div className="bg-[#1E1E1E] p-8 rounded-2xl border border-gray-800">
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold text-white uppercase italic flex items-center gap-2">
                        <Flag className="text-[#E10600]"/> Información
                    </h2>
                    {cat.calendario_url && cat.activa && (
                        <a href={cat.calendario_url} target="_blank" rel="noreferrer" className="text-[#E10600] text-xs font-bold uppercase flex items-center gap-1 hover:underline">
                            <Calendar size={14}/> Ver Calendario Actual
                        </a>
                    )}
                </div>
                <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-line">{cat.descripcion}</p>
            </div>

            {/* 2. Tarjeta de Organización */}
            {cat.nombre_organizacion && (
                <div className="bg-[#121212] border border-gray-800 p-6 rounded-xl relative overflow-hidden group hover:border-[#E10600] transition-colors shadow-lg">
                    <div className="absolute top-0 right-0 bg-[#E10600] text-white text-[10px] font-bold px-3 py-1 uppercase tracking-wider rounded-bl-lg flex items-center gap-1">
                        <ShieldCheck size={12} /> Avalado por
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        {cat.logo_organizacion && (
                            <div className="bg-white p-3 rounded-lg w-24 h-24 flex items-center justify-center shrink-0 shadow-inner">
                                <img src={cat.logo_organizacion} alt={cat.siglas_organizacion} className="max-w-full max-h-full object-contain"/>
                            </div>
                        )}
                        <div className="flex-1 text-center md:text-left space-y-3">
                            <div>
                                <h3 className="text-2xl font-black italic text-white uppercase leading-none">{cat.nombre_organizacion}</h3>
                                <p className="text-gray-500 text-sm mt-1">Organismo oficial de regulación y arbitraje.</p>
                            </div>
                            <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                {cat.org_web && <a href={cat.org_web} target="_blank" rel="noreferrer" className="px-3 py-1 bg-gray-800 hover:bg-white hover:text-black text-gray-400 rounded text-xs font-bold uppercase tracking-wide transition-all border border-gray-700 flex items-center gap-2"><Globe size={12}/> Web</a>}
                                {cat.org_instagram && <a href={cat.org_instagram} target="_blank" rel="noreferrer" className="px-3 py-1 bg-gray-800 hover:bg-[#E1306C] hover:text-white text-gray-400 rounded text-xs font-bold uppercase tracking-wide transition-all border border-gray-700 flex items-center gap-2"><Instagram size={12}/> Insta</a>}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 3. VIDEO PRINCIPAL */}
            {cat.video_url && (
                <div className="space-y-4">
                     <h3 className="text-xl text-white font-bold uppercase mb-4 border-l-4 border-[#E10600] pl-3 flex items-center gap-2">
                        Presentación Oficial <Tv size={18} className="text-[#E10600]"/>
                    </h3>
                    <div className="bg-[#1E1E1E] rounded-xl overflow-hidden shadow-lg border border-gray-800 hover:border-[#E10600] transition-all">
                        <div className="relative pt-[56.25%] bg-black">
                            <iframe 
                                className="absolute top-0 left-0 w-full h-full"
                                src={`https://www.youtube.com/embed/${getYoutubeId(cat.video_url)}`}
                                title="Video Principal"
                                frameBorder="0"
                                loading="eager" // IMPORTANTE: No usar lazy
                                referrerPolicy="strict-origin-when-cross-origin" // IMPORTANTE: Para evitar bloqueos
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>
            )}

            {/* 4. LISTA DE VIDEOS (Highlights) */}
            {cat.videos && cat.videos.length > 0 && (
                <div>
                    <h3 className="text-xl text-white font-bold uppercase mb-4 border-l-4 border-[#E10600] pl-3 flex items-center gap-2">
                        Highlights & Media <PlayCircle size={18} className="text-[#E10600]"/>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {cat.videos.map((video) => {
                            const videoId = getYoutubeId(video.url_youtube);
                            return (
                                <div key={video.id} className="bg-[#1E1E1E] rounded-xl overflow-hidden shadow-lg border border-gray-800 hover:border-[#E10600] transition-all group">
                                    <div className="relative pt-[56.25%] bg-black">
                                        {videoId ? (
                                            <iframe 
                                                className="absolute top-0 left-0 w-full h-full"
                                                src={`https://www.youtube.com/embed/${videoId}`}
                                                title={video.titulo}
                                                frameBorder="0"
                                                loading="eager" // IMPORTANTE
                                                referrerPolicy="strict-origin-when-cross-origin" // IMPORTANTE
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                allowFullScreen
                                            ></iframe>
                                        ) : (
                                            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-gray-500">Link roto</div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h4 className="text-white font-bold text-sm leading-tight group-hover:text-[#E10600] transition-colors">{video.titulo}</h4>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* 5. Equipos */}
            <div>
                <h3 className="text-xl text-white font-bold uppercase mb-4 border-l-4 border-[#E10600] pl-3">Equipos / Constructores</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cat.equipos && cat.equipos.length > 0 ? (
                        cat.equipos.map(eq => (
                            <div key={eq.id} className="bg-[#1E1E1E] p-4 rounded-lg border border-gray-800 flex items-center justify-between hover:border-gray-600 transition-colors group">
                                <span className="text-white font-bold uppercase italic group-hover:text-[#E10600] transition-colors">{eq.nombre}</span>
                                {eq.web_oficial && <a href={eq.web_oficial} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white"><Globe size={16}/></a>}
                            </div>
                        ))
                    ) : (
                        <div className="text-gray-500 italic">No hay registros históricos disponibles.</div>
                    )}
                </div>
            </div>
        </div>

        {/* DERECHA (RESULTADOS) */}
        <div className="space-y-6">
            <div className="bg-[#121212] p-6 rounded-2xl border border-gray-800 shadow-xl sticky top-24">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-black italic text-white uppercase tracking-tighter">
                        Resultados <span className="text-[#E10600]">{cat.activa ? "Recientes" : "Históricos"}</span>
                    </h3>
                    <FileText size={20} className="text-gray-500"/>
                </div>

                {resultados.length > 0 ? (
                    <div className="space-y-4">
                        {resultados.map(res => (
                            <div key={res.id} className="bg-[#1E1E1E] p-4 rounded-xl border-l-4 border-[#E10600] hover:bg-gray-800 transition-colors group">
                                <span className="text-[10px] text-gray-500 font-mono block mb-1">
                                    {new Date(res.fecha).toLocaleDateString()}
                                </span>
                                <h4 className="text-white font-bold leading-tight mb-2 group-hover:text-[#E10600] transition-colors">
                                    {res.titulo}
                                </h4>
                                {res.link_resultado && (
                                    <a href={res.link_resultado} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[#E10600] text-xs font-bold uppercase tracking-wider hover:underline">
                                        Ver Tiempos <ExternalLink size={12}/>
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500 border border-dashed border-gray-800 rounded-xl">
                        <p className="text-sm">Aún no hay resultados cargados.</p>
                    </div>
                )}
            </div>
        </div>

      </div>
    </div>
  )
}

export default CategoriaDetalle