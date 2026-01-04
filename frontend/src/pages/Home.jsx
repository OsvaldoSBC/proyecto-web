import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { ChevronRight, Calendar, ArrowRight, Flag } from 'lucide-react'

function Home() {
  const [categorias, setCategorias] = useState([])
  const [noticiasRecientes, setNoticiasRecientes] = useState([])
  const [imagenesCarrusel, setImagenesCarrusel] = useState([])

  useEffect(() => {
    // 1. Cargar Categorías
    axios.get('http://127.0.0.1:8000/api/categorias/')
      .then(res => setCategorias(res.data))
      .catch(err => console.error(err))

    // 2. Cargar Noticias
    axios.get('http://127.0.0.1:8000/api/noticias/')
      .then(res => {
        const todasLasNoticias = res.data;
        setNoticiasRecientes(todasLasNoticias.slice(0, 3));
        const imagenes = todasLasNoticias.slice(0, 8).map(n => n.imagen_url).filter(Boolean);
        setImagenesCarrusel(imagenes);
      })
      .catch(err => console.error(err))
  }, [])

  const formatearFecha = (fechaString) => {
    return new Date(fechaString).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })
  }

  return (
    <div className="space-y-16 animate-fade-in">
      
      {/* SECCIÓN 1: BIENVENIDA HERO */}
      <div className="text-center mt-10 px-4">
        <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-4 text-white">
          Bienvenido al <span className="text-[#E10600]">Paddock</span>
        </h1>
        <p className="text-gray-400 text-xl max-w-2xl mx-auto">
          El corazón del automovilismo deportivo. Tu acceso directo a categorías, equipos y las últimas noticias.
        </p>
      </div>


      {/* SECCIÓN 2: BANNER CINEMÁTICO INFINITO (FULL WIDTH & COLOR) */}
      {imagenesCarrusel.length > 2 && (
        // TRUCO FULL WIDTH: w-screen y ml-[calc(-50vw+50%)] hacen que se salga del contenedor y ocupe todo el ancho
        <div className="relative w-screen ml-[calc(-50vw+50%)] h-96 md:h-[600px] overflow-hidden border-y-4 border-[#E10600] bg-black">
            
            {/* A. TEXTO ESTÁTICO (FLOTANDO ENCIMA) */}
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
                <h2 className="text-5xl md:text-8xl font-black italic uppercase text-white tracking-widest drop-shadow-[0_5px_5px_rgba(0,0,0,0.9)] leading-tight">
                    LA VELOCIDAD ESTÁ EN <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E10600] to-orange-500">NUESTRO ADN</span>
                </h2>
                <div className="mt-6 w-32 h-2 bg-[#E10600] rounded-full shadow-[0_0_15px_#E10600]"></div>
                <p className="text-gray-100 mt-6 text-xl md:text-2xl font-bold uppercase tracking-[0.3em] drop-shadow-lg">
                    Vive la pasión en cada curva
                </p>
            </div>

            {/* B. CAPA OSCURA (Para contraste, pero deja ver los colores) */}
            <div className="absolute inset-0 bg-black/40 z-20"></div>

            {/* C. CARRUSEL ANIMADO (FONDO FULL COLOR) */}
            <div className="absolute inset-0 flex items-center z-10">
                <div className="flex animate-scroll h-full transition-transform will-change-transform">
                    
                    {/* GRUPO 1 */}
                    {imagenesCarrusel.map((imgUrl, index) => (
                        // Ajustamos el ancho de cada imagen para que se vea bien en la altura nueva
                        <div key={`a-${index}`} className="w-[80vw] md:w-[40vw] h-full flex-shrink-0">
                            <img src={imgUrl} alt="Racing" className="w-full h-full object-cover" />
                        </div>
                    ))}

                    {/* GRUPO 2 (DUPLICADO PARA EL LOOP INFINITO) */}
                    {imagenesCarrusel.map((imgUrl, index) => (
                        <div key={`b-${index}`} className="w-[80vw] md:w-[40vw] h-full flex-shrink-0">
                            <img src={imgUrl} alt="Racing" className="w-full h-full object-cover" />
                        </div>
                    ))}
                    
                </div>
            </div>
        </div>
      )}


      {/* SECCIÓN 3: ÚLTIMAS NOTICIAS */}
      <div>
        <div className="flex items-center justify-between mb-8 border-b border-gray-800 pb-4">
             <h2 className="text-4xl font-black italic uppercase text-white tracking-tighter">
                 Últimas <span className="text-[#E10600]">Noticias</span>
             </h2>
             <Link to="/noticias" className="hidden md:flex items-center gap-2 bg-[#1E1E1E] text-white px-4 py-2 rounded-full font-bold uppercase text-xs tracking-widest border border-gray-700 hover:border-[#E10600] transition-all">
                 Ver el Blog Completo <ArrowRight size={14} />
             </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {noticiasRecientes.length > 0 ? (
                noticiasRecientes.map(nota => (
                    <Link to={`/noticias/${nota.id}`} key={nota.id} className="group block bg-[#1E1E1E] rounded-2xl overflow-hidden border border-gray-800 hover:border-[#E10600] transition-all duration-300 shadow-xl">
                        <div className="h-48 overflow-hidden relative">
                            <img src={nota.imagen_url} alt={nota.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                            {nota.nombre_organizacion && (
                                <span className="absolute top-3 left-3 bg-[#E10600] text-white text-[10px] font-bold px-2 py-1 rounded uppercase flex items-center gap-1">
                                    <Flag size={10} fill="white" /> {nota.nombre_organizacion}
                                </span>
                            )}
                        </div>
                        <div className="p-5">
                            <div className="flex items-center gap-2 text-gray-500 text-xs font-mono mb-2">
                                <Calendar size={12} /> {formatearFecha(nota.fecha)}
                            </div>
                            <h3 className="text-white font-bold text-lg uppercase italic leading-tight mb-3 line-clamp-2 group-hover:text-[#E10600] transition-colors">
                                {nota.titulo}
                            </h3>
                            <p className="text-gray-400 text-sm line-clamp-8">
                                {nota.resumen}
                            </p>
                             <div className="mt-4 text-[#E10600] text-xs font-bold uppercase flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">
                                Leer más <ArrowRight size={12}/>
                            </div>
                        </div>
                    </Link>
                ))
            ) : (
                <div className="col-span-3 text-center text-gray-500 py-10 italic">Cargando noticias recientes...</div>
            )}
        </div>
         <div className="md:hidden mt-6 text-center">
            <Link to="/noticias" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-bold uppercase">
                 Ver todas las noticias <ChevronRight size={16}/>
            </Link>
         </div>
      </div>


      {/* SECCIÓN 4: CARRUSEL DE CATEGORÍAS */}
      <div>
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-black italic uppercase text-white">Categorías <span className="text-[#E10600]">Oficiales</span></h2>
            <Link to="/categorias" className="text-gray-400 flex items-center gap-1 hover:text-white transition-colors text-sm font-bold uppercase">Ver todas <ChevronRight size={16}/></Link>
        </div>
        <div className="w-full overflow-x-auto pb-8 scrollbar-hide">
          <div className="flex gap-6 min-w-max">
            {categorias.map(cat => (
              <Link 
                to={`/categorias/${cat.id}`}
                key={cat.id} 
                className="relative w-64 h-80 rounded-xl overflow-hidden cursor-pointer group border-2 border-transparent hover:border-[#E10600] transition-all shadow-2xl flex-none"
              >
                <img src={cat.foto_url} alt={cat.nombre} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80"></div>
                <div className="absolute bottom-0 left-0 right-0 bg-[#E10600] p-3 transform translate-y-1 group-hover:translate-y-0 transition-transform">
                  <h3 className="text-white font-black text-lg uppercase italic text-center truncate">{cat.nombre}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      <div className="pb-20"></div>

    </div>
  )
}

export default Home