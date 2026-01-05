import { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { Search, FileText, ChevronRight, Trophy, Filter, ChevronDown, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

// --- TARJETA DE RESULTADO ---
const ResultadoCard = ({ res }) => {
    const fechaAVisualizar = res.fecha_manual ? new Date(res.fecha_manual) : null

    return (
        <Link 
            to={`/noticias/${res.id}`}
            className="group relative block w-full h-28 rounded-xl overflow-hidden border border-gray-700 hover:border-[#E10600] transition-all shadow-lg mb-4"
        >
            <div className="absolute inset-0">
                <img 
                    src={res.imagen_url || "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80"} 
                    alt="Background" 
                    className="w-full h-full object-cover blur-[2px] opacity-40 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors"></div>
            </div>

            <div className="relative h-full flex items-center px-6 gap-6">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#E10600]"></div>

                {fechaAVisualizar && (
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-lg text-center min-w-[60px] flex-shrink-0">
                        <span className="block text-white font-bold text-xl leading-none">{fechaAVisualizar.getDate()}</span>
                        <span className="block text-gray-300 text-[9px] uppercase tracking-wider">{fechaAVisualizar.toLocaleString('default', { month: 'short' })}</span>
                    </div>
                )}

                <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        {res.nombre_categoria && (
                            <span className="bg-[#E10600] text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1 w-fit">
                                <Trophy size={10}/> {res.nombre_categoria}
                            </span>
                        )}
                    </div>
                    <h3 className="text-white font-bold text-xl truncate group-hover:text-[#E10600] transition-colors">
                        {res.titulo}
                    </h3>
                    <p className="text-gray-400 text-xs truncate">
                        {res.resumen || "Resultados oficiales y tiempos detallados."}
                    </p>
                </div>

                <div className="bg-white/10 p-2 rounded-full group-hover:bg-[#E10600] transition-colors flex-shrink-0">
                    <ChevronRight size={20} className="text-white"/>
                </div>
            </div>
        </Link>
    )
}

// --- COMPONENTE PRINCIPAL ---
function Noticias() {
  const [noticias, setNoticias] = useState([])
  const [categorias, setCategorias] = useState([]) 
  const { user } = useContext(AuthContext)
  
  // ESTADOS
  const [vista, setVista] = useState('NOTICIAS') 
  const [busqueda, setBusqueda] = useState("")
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('TODAS') 

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/noticias/').then(res => setNoticias(res.data))
    axios.get('http://127.0.0.1:8000/api/categorias/').then(res => setCategorias(res.data))
  }, [])

  // LÓGICA DE FILTRADO
  const itemsFiltrados = noticias.filter(item => {
      const matchTexto = item.titulo.toLowerCase().includes(busqueda.toLowerCase())
      
      let matchVista = false
      if (vista === 'NOTICIAS') matchVista = (item.tipo === 'NOTICIA');
      if (vista === 'RESULTADOS') matchVista = (item.tipo === 'RESULTADO');

      const matchCategoria = categoriaSeleccionada === 'TODAS' || String(item.categoria) === String(categoriaSeleccionada);

      return matchTexto && matchVista && matchCategoria;
  })

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* HEADER (NUEVO) */}
      <div className="text-center pb-4">
        <h1 className="text-5xl md:text-6xl font-black italic uppercase text-white tracking-tighter mb-2">
          Últimas <span className="text-[#E10600]">Novedades</span>
        </h1>
        <p className="text-gray-400 font-medium tracking-wide text-sm uppercase">
            Crónicas, Análisis y Tiempos Oficiales
        </p>
      </div>

      {/* PESTAÑAS (TABS) */}
      <div className="flex justify-center gap-4">
          <button onClick={() => setVista('NOTICIAS')} className={`px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm transition-all ${vista === 'NOTICIAS' ? "bg-white text-black shadow-lg scale-105" : "bg-[#1E1E1E] text-gray-500 hover:text-white"}`}>
            Noticias
          </button>
          <button onClick={() => setVista('RESULTADOS')} className={`px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm transition-all flex items-center gap-2 ${vista === 'RESULTADOS' ? "bg-[#E10600] text-white shadow-lg shadow-red-900/50 scale-105" : "bg-[#1E1E1E] text-gray-500 hover:text-white"}`}>
            <FileText size={16}/> Resultados
          </button>
      </div>

      {/* --- BARRA DE HERRAMIENTAS (BUSCADOR + DROPDOWN) --- */}
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4">
          
          {/* BUSCADOR */}
          <div className="relative flex-grow">
             <Search className="absolute left-4 top-3.5 text-gray-500" size={20} />
             <input 
                type="text" 
                placeholder={`Buscar título en ${vista.toLowerCase()}...`}
                className="w-full bg-[#1E1E1E] border border-gray-700 rounded-lg py-3 pl-12 pr-4 text-white focus:border-[#E10600] outline-none transition-colors font-medium"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
             />
          </div>

          {/* DROPDOWN CATEGORÍAS */}
          <div className="relative min-w-[250px]">
              <Filter className="absolute left-4 top-3.5 text-[#E10600]" size={20} />
              
              <select 
                value={categoriaSeleccionada}
                onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                className="w-full bg-[#1E1E1E] border border-gray-700 rounded-lg py-3 pl-12 pr-10 text-white font-bold uppercase text-xs tracking-wider outline-none focus:border-[#E10600] appearance-none cursor-pointer transition-colors"
              >
                  <option value="TODAS">Todas las Categorías</option>
                  {categorias.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                  ))}
              </select>

              <div className="absolute right-4 top-3.5 pointer-events-none">
                  <ChevronDown size={16} className="text-gray-400"/>
              </div>
          </div>
      </div>

      {/* --- CONTENIDO --- */}
      
      {/* VISTA 1: NOTICIAS */}
      {vista === 'NOTICIAS' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {itemsFiltrados.map(nota => (
                 <Link to={`/noticias/${nota.id}`} key={nota.id} className="bg-[#1E1E1E] rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-600 transition-all flex flex-col h-full group">
                    <div className="h-48 overflow-hidden relative">
                        <img src={nota.imagen_url || "https://via.placeholder.com/400x200"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
                        <div className="absolute top-2 left-2 bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded uppercase backdrop-blur-md">
                            {nota.nombre_categoria || "General"}
                        </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                        <h2 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-[#E10600] transition-colors">{nota.titulo}</h2>
                        <p className="text-gray-400 text-sm line-clamp-3 mb-4 flex-grow">{nota.resumen}</p>
                        <span className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 mt-auto">Leer más <ChevronRight size={14}/></span>
                    </div>
                </Link>
            ))}
        </div>
      )}

      {/* VISTA 2: RESULTADOS */}
      {vista === 'RESULTADOS' && (
        <div className="flex flex-col gap-2 max-w-4xl mx-auto">
            {itemsFiltrados.map(res => (
                <ResultadoCard key={res.id} res={res} />
            ))}
        </div>
      )}
      
      {itemsFiltrados.length === 0 && (
          <div className="text-center py-20 border border-dashed border-gray-800 rounded-xl bg-[#1E1E1E]/50">
              <Search className="mx-auto text-gray-600 mb-4" size={48}/>
              <h3 className="text-xl font-bold text-white">No se encontraron resultados</h3>
              <p className="text-gray-400 mt-2">Intenta cambiar la categoría o la búsqueda.</p>
              {(categoriaSeleccionada !== 'TODAS' || busqueda !== "") && (
                  <button 
                    onClick={() => { setCategoriaSeleccionada('TODAS'); setBusqueda(""); }}
                    className="mt-4 text-[#E10600] font-bold uppercase text-xs hover:underline flex items-center justify-center gap-1"
                  >
                      <X size={14}/> Restablecer Filtros
                  </button>
              )}
          </div>
      )}
    </div>
  )
}

export default Noticias