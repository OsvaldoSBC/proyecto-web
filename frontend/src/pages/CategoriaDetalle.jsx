import { useEffect, useState, useContext } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import AuthContext from '../context/AuthContext' // <--- IMPORTANTE
import { 
  Calendar, 
  Users, 
  ChevronLeft, 
  CheckCircle, 
  AlertCircle, 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  Globe,
  Bell,         // <--- Icono para seguir
  BellOff       // <--- Icono para dejar de seguir
} from 'lucide-react'

function CategoriaDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, authTokens } = useContext(AuthContext) // <--- Traemos al usuario y su token
  
  const [cat, setCat] = useState(null)
  const [suscrito, setSuscrito] = useState(false) // <--- Estado del botón
  const [cargandoSuscripcion, setCargandoSuscripcion] = useState(false)

  // 1. CARGAR DATOS DE LA CATEGORÍA
  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/categorias/${id}/`)
      .then(res => setCat(res.data))
      .catch(err => console.error(err))
  }, [id])

  // 2. VERIFICAR SI YA LA SIGO (Solo si hay usuario)
  useEffect(() => {
    if (user && authTokens) {
      axios.get('http://127.0.0.1:8000/api/mi-perfil/', {
        headers: { 'Authorization': `Bearer ${authTokens.access}` }
      })
      .then(res => {
        // Si el ID de esta categoría está en mi lista de suscripciones, pongo TRUE
        const idsQueSigo = res.data.suscripciones
        // Convertimos id a número por si acaso viene como string
        if (idsQueSigo.includes(Number(id))) {
          setSuscrito(true)
        }
      })
      .catch(err => console.error("Error cargando perfil", err))
    }
  }, [id, user, authTokens])


  // 3. FUNCIÓN PARA DAR CLICK AL BOTÓN
  const handleSuscripcion = async () => {
    if (!user) {
      // Si no está logueado, lo mandamos al login
      alert("Debes iniciar sesión para seguir una categoría.")
      navigate('/login')
      return
    }

    setCargandoSuscripcion(true)
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/suscribirse/${id}/`, 
        {}, 
        { headers: { 'Authorization': `Bearer ${authTokens.access}` } }
      )
      
      // La API nos devuelve si quedamos suscritos (true) o no (false)
      setSuscrito(response.data.suscrito)
      
    } catch (error) {
      console.error(error)
      alert("Hubo un error al intentar suscribirse.")
    }
    setCargandoSuscripcion(false)
  }

  if (!cat) return <div className="text-white text-center py-20">Cargando datos...</div>

  return (
    <div className="space-y-8 animate-fade-in-up">
      
      <Link to="/categorias" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors">
        <ChevronLeft size={20} /> Volver al listado
      </Link>

      {/* HERO SECTION */}
      <div className="relative h-[500px] rounded-3xl overflow-hidden border border-gray-800 shadow-2xl group">
        <img src={cat.foto_url} alt={cat.nombre} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-black/50 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 p-8 w-full">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="flex gap-4">
                {/* Org Info */}
                <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md p-2 rounded-lg border border-gray-700 w-fit">
                {cat.logo_organizacion && (
                    <img src={cat.logo_organizacion} alt="Org Logo" className="w-8 h-8 bg-white rounded-full p-1 object-contain" />
                )}
                <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest">Avalado por</span>
                    <span className="text-white font-bold uppercase text-xs">{cat.siglas_organizacion || "Organización"}</span>
                </div>
                </div>

                {/* Redes Org */}
                {(cat.org_web || cat.org_facebook || cat.org_instagram || cat.org_twitter || cat.org_youtube) && (
                <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md p-2 rounded-lg border border-gray-700 h-full">
                    {cat.org_web && <a href={cat.org_web} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors"><Globe size={14} /></a>}
                    {cat.org_facebook && <a href={cat.org_facebook} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#1877F2] transition-colors"><Facebook size={14} /></a>}
                    {cat.org_instagram && <a href={cat.org_instagram} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#E4405F] transition-colors"><Instagram size={14} /></a>}
                    {cat.org_twitter && <a href={cat.org_twitter} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#1DA1F2] transition-colors"><Twitter size={14} /></a>}
                    {cat.org_youtube && <a href={cat.org_youtube} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#FF0000] transition-colors"><Youtube size={14} /></a>}
                </div>
                )}
            </div>

            {/* --- BOTÓN DE SUSCRIPCIÓN (AQUÍ ESTÁ) --- */}
            <button
                onClick={handleSuscripcion}
                disabled={cargandoSuscripcion}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold uppercase tracking-widest text-xs transition-all shadow-lg ${
                    suscrito 
                    ? "bg-[#E10600] text-white hover:bg-red-700 border border-transparent" // Estilo ACTIVADO
                    : "bg-white/10 text-white hover:bg-white hover:text-black border border-white/30 backdrop-blur-md" // Estilo DESACTIVADO
                }`}
            >
                {cargandoSuscripcion ? (
                    "Procesando..."
                ) : suscrito ? (
                    <> <BellOff size={16} /> Siguiendo </>
                ) : (
                    <> <Bell size={16} /> Seguir Categoría </>
                )}
            </button>

          </div>

          <h1 className="text-5xl md:text-8xl font-black italic text-white uppercase tracking-tighter drop-shadow-lg mb-4">
            {cat.nombre}
          </h1>
          
          {/* Redes de la categoría... */}
          <div className="flex flex-wrap items-center gap-4">
             {/* ... (mismo código de redes de antes) ... */}
             {cat.web_oficial && (
                <a href={cat.web_oficial} target="_blank" rel="noreferrer" className="bg-white/10 hover:bg-white hover:text-[#E10600] text-white px-4 py-2 rounded-full font-bold uppercase text-xs tracking-wider flex items-center gap-2 transition-colors border border-white/20 backdrop-blur-md">
                    <Globe size={16} /> Sitio Oficial
                </a>
             )}
             {/* ... */}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* COLUMNA IZQUIERDA: Descripción y VIDEO */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-[#1E1E1E] p-8 rounded-2xl border border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-4 uppercase italic">Sobre la Categoría</h2>
            <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-line">
              {cat.descripcion}
            </p>
            {cat.calendario_url && (
              <a href={cat.calendario_url} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 bg-[#E10600] hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold uppercase tracking-wide transition-all shadow-lg shadow-red-900/20">
                <Calendar size={20} /> Ver Calendario Oficial
              </a>
            )}
          </div>

          {/* VIDEO / IMAGEN 16:9 */}
          <div className="aspect-video rounded-2xl overflow-hidden border border-gray-800 shadow-xl relative group">
             {cat.video_url ? (
               <iframe 
                 className="w-full h-full" 
                 src={cat.video_url.replace("watch?v=", "embed/")} 
                 title="Video" 
                 allowFullScreen
               ></iframe>
             ) : (
               <div className="w-full h-full relative">
                 <img src={cat.foto_url} alt="Vista Categoría" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                 <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
               </div>
             )}
          </div>
        </div>

        {/* COLUMNA DERECHA: Equipos */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-white font-bold uppercase text-xl mb-4 border-l-4 border-[#E10600] pl-3">
            <Users className="text-[#E10600]" /> Parrilla Oficial
          </div>

          {cat.equipos && cat.equipos.length > 0 ? (
            cat.equipos.map(equipo => (
              <div key={equipo.id} className="bg-[#1E1E1E] p-5 rounded-xl border border-gray-800 hover:border-[#E10600] transition-all">
                <div className="mb-4 pb-3 border-b border-gray-700">
                    <h3 className="font-bold text-white text-lg uppercase italic tracking-wide">{equipo.nombre}</h3>
                </div>
                <div className="flex gap-4">
                  {!equipo.web_oficial && !equipo.facebook && !equipo.instagram && !equipo.twitter && (
                     <span className="text-xs text-gray-600 italic">Contacto privado</span>
                  )}
                  {equipo.web_oficial && <a href={equipo.web_oficial} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors"><Globe size={18} /></a>}
                  {equipo.facebook && <a href={equipo.facebook} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#1877F2] transition-colors"><Facebook size={18} /></a>}
                  {equipo.instagram && <a href={equipo.instagram} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#E4405F] transition-colors"><Instagram size={18} /></a>}
                  {equipo.twitter && <a href={equipo.twitter} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#1DA1F2] transition-colors"><Twitter size={18} /></a>}
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500 italic p-6 border border-dashed border-gray-700 rounded-xl text-center">
              No hay equipos inscritos aún.
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default CategoriaDetalle