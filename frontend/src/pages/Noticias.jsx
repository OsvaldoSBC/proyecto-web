import { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { Calendar, User, Trophy, Flag, ArrowRight, Search, Filter, X, Bell } from 'lucide-react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext' // <--- IMPORTANTE

function Noticias() {
  const [noticias, setNoticias] = useState([])
  const { user, authTokens } = useContext(AuthContext) // Traemos al usuario
  
  // ESTADOS DE FILTRO
  const [busqueda, setBusqueda] = useState("")
  const [filtroOrg, setFiltroOrg] = useState("")
  const [filtroCat, setFiltroCat] = useState("")
  const [filtroEquipo, setFiltroEquipo] = useState("")
  
  // ESTADOS NUEVOS PARA SUSCRIPCIONES
  const [soloMisNoticias, setSoloMisNoticias] = useState(false)
  const [misCategoriasIds, setMisCategoriasIds] = useState([])

  // 1. CARGAR NOTICIAS (GENERAL)
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/noticias/')
      .then(res => setNoticias(res.data))
      .catch(err => console.error(err))
  }, [])

  // 2. CARGAR MIS SUSCRIPCIONES (SOLO SI HAY USUARIO)
  useEffect(() => {
    if (user && authTokens) {
        axios.get('http://127.0.0.1:8000/api/mi-perfil/', {
            headers: { 'Authorization': `Bearer ${authTokens.access}` }
        })
        .then(res => {
            // Guardamos los IDs de las categorías que sigo. Ej: [1, 5, 8]
            setMisCategoriasIds(res.data.suscripciones)
        })
        .catch(err => console.error("Error cargando perfil", err))
    }
  }, [user, authTokens])

  // --- OBTENER LISTAS ÚNICAS PARA LOS DROPDOWNS ---
  const orgsDisponibles = [...new Set(noticias.map(n => n.nombre_organizacion).filter(Boolean))]
  const catsDisponibles = [...new Set(noticias.map(n => n.nombre_categoria).filter(Boolean))]
  const equiposDisponibles = [...new Set(noticias.map(n => n.nombre_equipo).filter(Boolean))]

  // --- LÓGICA DE FILTRADO MAESTRA ---
  const noticiasFiltradas = noticias.filter(nota => {
    // A. Filtro de Texto
    const textoMatch = 
      nota.titulo.toLowerCase().includes(busqueda.toLowerCase()) || 
      nota.resumen.toLowerCase().includes(busqueda.toLowerCase())

    // B. Filtros de Selectores
    const orgMatch = filtroOrg ? nota.nombre_organizacion === filtroOrg : true
    const catMatch = filtroCat ? nota.nombre_categoria === filtroCat : true
    const equipoMatch = filtroEquipo ? nota.nombre_equipo === filtroEquipo : true

    // C. FILTRO DE SUSCRIPCIÓN (NUEVO)
    // Si el botón está activo, la noticia debe pertenecer a una categoría que yo siga
    // 'nota.categoria' es el ID numérico que viene de la base de datos
    const misNoticiasMatch = soloMisNoticias 
        ? misCategoriasIds.includes(nota.categoria) 
        : true

    return textoMatch && orgMatch && catMatch && equipoMatch && misNoticiasMatch
  })

  // Función para limpiar todo
  const limpiarFiltros = () => {
    setBusqueda("")
    setFiltroOrg("")
    setFiltroCat("")
    setFiltroEquipo("")
    setSoloMisNoticias(false)
  }

  const formatearFecha = (fechaString) => {
    const opciones = { year: 'numeric', month: 'short', day: 'numeric' }
    return new Date(fechaString).toLocaleDateString('es-MX', opciones)
  }

  return (
    <div className="space-y-10 animate-fade-in">
      
      {/* HEADER */}
      <div className="text-center pb-4">
        <h1 className="text-5xl md:text-6xl font-black italic uppercase text-white tracking-tighter mb-4">
          Noticias <span className="text-[#E10600]">Racing</span>
        </h1>
        <p className="text-gray-400 text-xl">Lo último del mundo motor en un solo lugar.</p>
      </div>

      {/* --- BARRA DE HERRAMIENTAS DE FILTRADO --- */}
      <div className="bg-[#1E1E1E] p-6 rounded-2xl border border-gray-800 shadow-xl">
        <div className="flex flex-col gap-4">
          
          {/* Fila 1: Buscador y Botón Limpiar */}
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-grow w-full">
              <Search className="absolute left-4 top-3.5 text-gray-500" size={20} />
              <input 
                type="text" 
                placeholder="Buscar en títulos o contenido..." 
                className="w-full bg-black/30 border border-gray-700 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#E10600] transition-all"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            
            {(busqueda || filtroOrg || filtroCat || filtroEquipo || soloMisNoticias) && (
              <button 
                onClick={limpiarFiltros}
                className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-[#E10600] text-white px-6 py-3 rounded-lg font-bold uppercase text-xs transition-colors whitespace-nowrap"
              >
                <X size={16} /> Limpiar Todo
              </button>
            )}
          </div>

          {/* Fila 2: BOTÓN DE SUSCRIPCIÓN (Solo si hay usuario) */}
          {user && (
             <div className="flex items-center">
                 <button 
                    onClick={() => setSoloMisNoticias(!soloMisNoticias)}
                    className={`flex items-center gap-2 px-5 py-2 rounded-full font-bold uppercase text-xs transition-all border ${
                        soloMisNoticias 
                        ? "bg-[#E10600] text-white border-[#E10600] shadow-[0_0_15px_#E10600]" 
                        : "bg-transparent text-gray-400 border-gray-600 hover:border-white hover:text-white"
                    }`}
                 >
                    <Bell size={16} className={soloMisNoticias ? "fill-white" : ""} />
                    {soloMisNoticias ? "Viendo Mis Suscripciones" : "Ver solo lo que sigo"}
                 </button>
             </div>
          )}

          {/* Fila 3: Los 3 Selectores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-800 pt-4">
            
            {/* Filtro Organización */}
            <div className="relative">
              <Flag className="absolute left-3 top-3.5 text-[#E10600]" size={16} />
              <select 
                className="w-full bg-black/30 border border-gray-700 rounded-lg py-3 pl-10 pr-8 text-gray-300 focus:outline-none focus:border-[#E10600] appearance-none cursor-pointer"
                value={filtroOrg}
                onChange={(e) => setFiltroOrg(e.target.value)}
              >
                <option value="">Todas las Organizaciones</option>
                {orgsDisponibles.map((org, i) => <option key={i} value={org}>{org}</option>)}
              </select>
            </div>

            {/* Filtro Categoría */}
            <div className="relative">
              <Trophy className="absolute left-3 top-3.5 text-yellow-500" size={16} />
              <select 
                className="w-full bg-black/30 border border-gray-700 rounded-lg py-3 pl-10 pr-8 text-gray-300 focus:outline-none focus:border-[#E10600] appearance-none cursor-pointer"
                value={filtroCat}
                onChange={(e) => setFiltroCat(e.target.value)}
              >
                <option value="">Todas las Categorías</option>
                {catsDisponibles.map((cat, i) => <option key={i} value={cat}>{cat}</option>)}
              </select>
            </div>

            {/* Filtro Equipo */}
            <div className="relative">
              <User className="absolute left-3 top-3.5 text-blue-400" size={16} />
              <select 
                className="w-full bg-black/30 border border-gray-700 rounded-lg py-3 pl-10 pr-8 text-gray-300 focus:outline-none focus:border-[#E10600] appearance-none cursor-pointer"
                value={filtroEquipo}
                onChange={(e) => setFiltroEquipo(e.target.value)}
              >
                <option value="">Todos los Equipos</option>
                {equiposDisponibles.map((eq, i) => <option key={i} value={eq}>{eq}</option>)}
              </select>
            </div>

          </div>
        </div>
      </div>

      {/* --- RESULTADOS --- */}
      {noticiasFiltradas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {noticiasFiltradas.map(nota => (
            <article key={nota.id} className="bg-[#1E1E1E] rounded-2xl overflow-hidden border border-gray-800 hover:border-[#E10600] transition-all duration-300 shadow-2xl flex flex-col group h-full">
              
              {/* Imagen */}
              <div className="h-56 overflow-hidden relative">
                <img 
                  src={nota.imagen_url} 
                  alt={nota.titulo} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {nota.nombre_organizacion && (
                    <span className="bg-black/80 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded uppercase flex items-center gap-1 border border-gray-600">
                      <Flag size={10} className="text-[#E10600]"/> {nota.nombre_organizacion}
                    </span>
                  )}
                </div>
              </div>

              {/* Contenido */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-gray-500 text-xs font-mono">
                        <Calendar size={12} /> {formatearFecha(nota.fecha)}
                    </div>
                    {/* Iconitos de Cat y Equipo si existen */}
                    <div className="flex gap-2">
                        {nota.nombre_categoria && <Trophy size={14} className="text-yellow-600" title={nota.nombre_categoria}/>}
                        {nota.nombre_equipo && <User size={14} className="text-blue-500" title={nota.nombre_equipo}/>}
                    </div>
                </div>

                <h2 className="text-xl font-bold text-white uppercase italic leading-tight mb-3 group-hover:text-[#E10600] transition-colors">
                  {nota.titulo}
                </h2>

                {/* AQUÍ ESTÁ EL CAMBIO DE LINE-CLAMP-6 */}
                <p className="text-gray-400 text-sm line-clamp-6 mb-6 flex-grow">
                  {nota.resumen}
                </p>

                <Link 
                  to={`/noticias/${nota.id}`} 
                  className="inline-flex items-center gap-2 text-white font-bold uppercase text-xs tracking-widest hover:text-[#E10600] transition-colors mt-auto border-t border-gray-800 pt-4"
                >
                  Leer Nota Completa <ArrowRight size={16} />
                </Link>
              </div>

            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-gray-800 rounded-2xl">
            <Filter size={48} className="mx-auto text-gray-600 mb-4"/>
            <h3 className="text-xl text-white font-bold mb-2">Sin resultados</h3>
            <p className="text-gray-500">No hay noticias que coincidan con tus filtros.</p>
            <button onClick={limpiarFiltros} className="mt-4 text-[#E10600] hover:underline font-bold">Limpiar filtros</button>
        </div>
      )}
    </div>
  )
}

export default Noticias