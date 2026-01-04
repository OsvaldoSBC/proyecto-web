import { useEffect, useState } from 'react'
import axios from 'axios'
import { Trophy, ArrowRight, Search } from 'lucide-react'
import { Link } from 'react-router-dom'

const getYoutubeEmbed = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
}

function Categorias() {
  const [categorias, setCategorias] = useState([])
  const [busqueda, setBusqueda] = useState("") // <--- Estado del buscador

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/categorias/')
      .then(res => setCategorias(res.data))
      .catch(err => console.error("Error:", err))
  }, [])

  // --- FILTRADO DOBLE ---
  // Buscamos en el nombre de la categoría O en el nombre de la organización
  const categoriasFiltradas = categorias.filter(cat => 
    cat.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
    (cat.nombre_organizacion && cat.nombre_organizacion.toLowerCase().includes(busqueda.toLowerCase()))
  )

  return (
    <div className="space-y-12 animate-fade-in">
      
      {/* HEADER CON BUSCADOR */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-l-8 border-[#E10600] pl-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black italic uppercase text-white tracking-tighter">
            Categorías <span className="text-[#E10600]">Oficiales</span>
          </h1>
          <p className="text-gray-400 mt-2 text-lg">Encuentra tu serie favorita.</p>
        </div>

        {/* BUSCADOR */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-3.5 text-gray-500" size={20} />
          <input 
            type="text" 
            placeholder="Buscar categoría u organización..." 
            className="w-full bg-[#1E1E1E] border border-gray-700 rounded-full py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#E10600] transition-all"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      {/* LISTA FILTRADA */}
      <div className="grid grid-cols-1 gap-12">
        {categoriasFiltradas.length > 0 ? (
          categoriasFiltradas.map(cat => {
            const videoEmbed = getYoutubeEmbed(cat.video_url);

            return (
              <div key={cat.id} className="bg-[#1E1E1E] rounded-2xl overflow-hidden border border-gray-800 shadow-2xl hover:border-[#E10600] transition-all duration-300">
                
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  
                  {/* Multimedia */}
                  <div className="h-64 lg:h-auto relative bg-black">
                    {videoEmbed ? (
                      <iframe 
                        className="w-full h-full object-cover"
                        src={videoEmbed} 
                        title={cat.nombre}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <img src={cat.foto_url} alt={cat.nombre} className="w-full h-full object-cover opacity-90" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-8 flex flex-col justify-center bg-gradient-to-br from-[#1E1E1E] to-[#121212]">
                    <div className="flex items-center gap-2 text-[#E10600] font-bold uppercase tracking-widest text-xs mb-2">
                      <Trophy size={14} />
                      {cat.nombre_organizacion || "Organización Oficial"}
                    </div>
                    
                    <h2 className="text-4xl font-black italic text-white uppercase mb-4">{cat.nombre}</h2>
                    <p className="text-gray-400 mb-8 line-clamp-3">{cat.descripcion}</p>
                    
                    <Link 
                      to={`/categorias/${cat.id}`} 
                      className="self-start flex items-center gap-2 bg-[#121212] border border-gray-700 text-white px-8 py-4 rounded font-bold uppercase tracking-wider hover:bg-[#E10600] hover:border-[#E10600] transition-all group"
                    >
                      Ver Ficha Técnica <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
                    </Link>

                  </div>
                </div>
              </div>
            )
          })
        ) : (
           <div className="text-center py-20 text-gray-500 italic border border-dashed border-gray-800 rounded-xl">
              No encontramos ninguna categoría con ese nombre.
           </div>
        )}
      </div>
    </div>
  )
}

export default Categorias