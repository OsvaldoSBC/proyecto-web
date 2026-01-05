import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Search, ChevronRight, Shield, Users } from 'lucide-react'

function Equipos() {
  const [equipos, setEquipos] = useState([])
  const [busqueda, setBusqueda] = useState("")

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/equipos/')
      .then(res => setEquipos(res.data))
      .catch(err => console.error(err))
  }, [])

  const equiposFiltrados = equipos.filter(eq => 
    eq.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    (eq.nombre_categoria && eq.nombre_categoria.toLowerCase().includes(busqueda.toLowerCase()))
  )

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      
      {/* HEADER */}
      <div className="text-center py-10">
        <h1 className="text-5xl md:text-7xl font-black italic uppercase text-white tracking-tighter mb-4">
          Escuderías <span className="text-[#E10600]">Oficiales</span>
        </h1>
        <p className="text-gray-400 font-medium tracking-wide text-sm uppercase">
            Conoce a los protagonistas de la pista
        </p>
      </div>

      {/* BUSCADOR */}
      <div className="max-w-md mx-auto relative mb-12">
         <Search className="absolute left-4 top-3.5 text-gray-500" size={20} />
         <input 
            type="text" 
            placeholder="Buscar equipo o categoría..."
            className="w-full bg-[#1E1E1E] border border-gray-700 rounded-full py-3 pl-12 pr-4 text-white focus:border-[#E10600] outline-none transition-colors"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
         />
      </div>

      {/* GRID DE EQUIPOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {equiposFiltrados.map(eq => (
              <div key={eq.id} className="bg-[#1E1E1E] rounded-2xl p-6 border border-gray-800 hover:border-[#E10600] transition-all group hover:-translate-y-1 hover:shadow-2xl flex flex-col">
                  
                  {/* CABECERA TARJETA */}
                  <div className="flex items-start justify-between mb-6">
                      <div className="w-16 h-16 bg-white/5 rounded-xl p-2 border border-white/10 flex items-center justify-center">
                          {eq.logo_url ? (
                              <img src={eq.logo_url} alt={eq.nombre} className="w-full h-full object-contain"/>
                          ) : (
                              <Shield className="text-gray-600"/>
                          )}
                      </div>
                      {eq.nombre_categoria && (
                          <span className="bg-[#E10600]/10 text-[#E10600] text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider border border-[#E10600]/20">
                              {eq.nombre_categoria}
                          </span>
                      )}
                  </div>

                  {/* INFO */}
                  <div className="flex-grow">
                      <h3 className="text-2xl font-black italic text-white uppercase leading-none mb-2">{eq.nombre}</h3>
                      
                      {/* REDES SOCIALES MINI */}
                      <div className="flex gap-3 mt-4 text-gray-500">
                           {eq.web_oficial && <GlobeIcon url={eq.web_oficial} />}
                           {eq.twitter && <SocialIcon type="tw" />}
                           {eq.instagram && <SocialIcon type="ig" />}
                           {eq.facebook && <SocialIcon type="fb" />}
                      </div>
                  </div>

                  {/* PILOTOS (PREVIEW) */}
                  <div className="mt-6 pt-4 border-t border-gray-800">
                      <div className="flex items-center justify-between text-xs text-gray-400 font-bold uppercase tracking-wider mb-3">
                          <span className="flex items-center gap-1"><Users size={12}/> Alineación</span>
                      </div>
                      <div className="space-y-2">
                          {/* Mostramos máximo 2 pilotos para no saturar */}
                          {eq.pilotos && eq.pilotos.slice(0, 2).map(piloto => (
                              <div key={piloto.id} className="flex items-center gap-2 bg-black/20 p-2 rounded-lg">
                                  <div className="w-6 h-6 rounded-full bg-gray-700 overflow-hidden">
                                      <img src={piloto.foto_url || "https://via.placeholder.com/50"} className="w-full h-full object-cover"/>
                                  </div>
                                  <span className="text-white text-sm font-bold">{piloto.nombre}</span>
                                  <span className="text-gray-600 text-[9px] ml-auto">{piloto.nacionalidad}</span>
                              </div>
                          ))}
                          {eq.pilotos && eq.pilotos.length > 2 && (
                              <div className="text-center text-[10px] text-gray-500 pt-1">
                                  + {eq.pilotos.length - 2} pilotos más
                              </div>
                          )}
                          {(!eq.pilotos || eq.pilotos.length === 0) && (
                              <span className="text-gray-600 text-xs italic">Alineación por confirmar</span>
                          )}
                      </div>
                  </div>

              </div>
          ))}
      </div>

      {equiposFiltrados.length === 0 && (
          <div className="text-center text-gray-500 py-20">No se encontraron escuderías.</div>
      )}
    </div>
  )
}

// Pequeños componentes auxiliares para iconos
const GlobeIcon = ({url}) => <a href={url} target="_blank" className="hover:text-white transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg></a>
const SocialIcon = ({type}) => <span className="hover:text-white transition-colors cursor-default">{type === 'tw' ? '𝕏' : type === 'ig' ? 'Ig' : 'Fb'}</span>

export default Equipos