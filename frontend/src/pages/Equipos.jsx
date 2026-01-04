import { useEffect, useState } from 'react'
import axios from 'axios'
import { Facebook, Instagram, Twitter, Globe, Users, Search, Filter, User } from 'lucide-react'

function Equipos() {
  const [equipos, setEquipos] = useState([])
  const [busqueda, setBusqueda] = useState("")
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todas") // <--- Nuevo Estado

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/equipos/')
      .then(res => setEquipos(res.data))
      .catch(err => console.error(err))
  }, [])

  // 1. OBTENER LISTA DE CATEGORÍAS ÚNICAS
  // Recorremos todos los equipos, sacamos sus categorías y quitamos duplicados
  const categoriasDisponibles = ["Todas", ...new Set(equipos.map(e => e.nombre_categoria).filter(Boolean))]

  // 2. FILTRADO DOBLE (Nombre Y Categoría)
  const equiposFiltrados = equipos.filter(equipo => {
    const coincideTexto = equipo.nombre.toLowerCase().includes(busqueda.toLowerCase())
    const coincideCategoria = categoriaSeleccionada === "Todas" || equipo.nombre_categoria === categoriaSeleccionada
    
    return coincideTexto && coincideCategoria
  })

  return (
    <div className="space-y-8 animate-fade-in">
      
      <div className="text-center max-w-4xl mx-auto mb-10">
        <h1 className="text-4xl md:text-5xl font-black italic uppercase text-white mb-4">
          Escuderías <span className="text-[#E10600]">Registradas</span>
        </h1>
        <p className="text-gray-400 mb-8">
          Filtra por nombre o categoría para encontrar tu equipo.
        </p>

        {/* --- ZONA DE FILTROS --- */}
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          
          {/* BUSCADOR DE TEXTO */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-3.5 text-gray-500" size={20} />
            <input 
              type="text" 
              placeholder="Buscar equipo..." 
              className="w-full bg-[#1E1E1E] border border-gray-700 rounded-full py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#E10600] focus:ring-1 focus:ring-[#E10600] transition-all"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          {/* SELECTOR DE CATEGORÍA */}
          <div className="relative w-full md:w-64">
            <Filter className="absolute left-4 top-3.5 text-gray-500" size={20} />
            <select 
              className="w-full bg-[#1E1E1E] border border-gray-700 rounded-full py-3 pl-12 pr-10 text-white focus:outline-none focus:border-[#E10600] focus:ring-1 focus:ring-[#E10600] appearance-none cursor-pointer transition-all"
              value={categoriaSeleccionada}
              onChange={(e) => setCategoriaSeleccionada(e.target.value)}
            >
              {categoriasDisponibles.map((cat, index) => (
                <option key={index} value={cat} className="bg-[#1E1E1E]">
                  {cat === "Todas" ? "Todas las Categorías" : cat}
                </option>
              ))}
            </select>
            {/* Flechita personalizada (CSS trick) */}
            <div className="absolute right-4 top-4 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-500"></div>
          </div>

        </div>
      </div>

      {/* GRID DE RESULTADOS */}
      {equiposFiltrados.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {equiposFiltrados.map(equipo => (
            <div key={equipo.id} className="bg-[#1E1E1E] p-8 rounded-xl border border-gray-800 hover:border-[#E10600] transition-all duration-300 group shadow-lg flex flex-col min-h-[180px]">
              
              {/* Cabecera */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2 text-[#E10600] text-xs font-bold uppercase tracking-widest">
                  <Users size={14} />
                  {equipo.nombre_categoria || "Categoría Oficial"}
                </div>
                <h3 className="text-white font-black text-2xl uppercase italic tracking-tighter group-hover:text-gray-200 transition-colors">
                  {equipo.nombre}
                </h3>
              </div>

              {/* Lista de Pilotos */}
              <div className="mb-6 flex-grow">
                <p className="text-xs text-gray-500 font-bold uppercase mb-2 border-b border-gray-700 pb-1">Alineación:</p>
                <div className="space-y-2">
                  {equipo.pilotos && equipo.pilotos.length > 0 ? (
                    equipo.pilotos.map(piloto => (
                      <div key={piloto.id} className="flex items-center gap-2 text-gray-300 text-sm">
                         <User size={14} className="text-[#E10600]" /> 
                         {piloto.nombre}
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-gray-600 italic">Asientos disponibles</span>
                  )}
                </div>
              </div>

              {/* Redes Sociales */}
              <div className="pt-4 border-t border-gray-700 flex gap-4 mt-auto">
                {!equipo.web_oficial && !equipo.facebook && !equipo.instagram && !equipo.twitter && (
                  <span className="text-xs text-gray-600 italic">Contacto privado</span>
                )}
                {equipo.web_oficial && (
                  <a href={equipo.web_oficial} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors"><Globe size={20} /></a>
                )}
                {equipo.facebook && (
                  <a href={equipo.facebook} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#1877F2] transition-colors"><Facebook size={20} /></a>
                )}
                {equipo.instagram && (
                  <a href={equipo.instagram} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#E4405F] transition-colors"><Instagram size={20} /></a>
                )}
                {equipo.twitter && (
                  <a href={equipo.twitter} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#1DA1F2] transition-colors"><Twitter size={20} /></a>
                )}
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#1E1E1E] rounded-xl border border-gray-800">
          <p className="text-gray-400 text-lg">No encontramos equipos con esos filtros. 🏁</p>
          <button 
            onClick={() => {setBusqueda(""); setCategoriaSeleccionada("Todas")}}
            className="mt-4 text-[#E10600] font-bold uppercase hover:underline"
          >
            Limpiar Filtros
          </button>
        </div>
      )}
    </div>
  )
}

export default Equipos