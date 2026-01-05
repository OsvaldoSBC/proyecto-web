import { useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import AuthContext from '../context/AuthContext'
import { Bell, Trophy, Filter, X } from 'lucide-react'

function Categorias() {
  const [categorias, setCategorias] = useState([])
  const { user, authTokens } = useContext(AuthContext)
  const [misSuscripciones, setMisSuscripciones] = useState([])
  
  const [verSoloMisSuscripciones, setVerSoloMisSuscripciones] = useState(false)

  useEffect(() => {
    // Carga inicial de categorías
    axios.get('http://127.0.0.1:8000/api/categorias/')
      .then(res => setCategorias(res.data))
      .catch(err => console.error(err))

    // Carga de suscripciones si el usuario está autenticado
    if (user && authTokens) {
        axios.get('http://127.0.0.1:8000/api/mi-perfil/', {
            headers: { 'Authorization': `Bearer ${authTokens.access}` }
        })
        .then(res => setMisSuscripciones(res.data.suscripciones))
        .catch(err => console.error(err))
    }
  }, [user, authTokens])

  let categoriasAVisualizar = [...categorias]

  // Filtrado por suscripciones
  if (verSoloMisSuscripciones) {
      categoriasAVisualizar = categoriasAVisualizar.filter(cat => misSuscripciones.includes(cat.id))
  }

  // Ordenamiento: Categorías suscritas primero
  categoriasAVisualizar.sort((a, b) => {
      const aEsFav = misSuscripciones.includes(a.id);
      const bEsFav = misSuscripciones.includes(b.id);
      if (aEsFav && !bEsFav) return -1;
      if (!aEsFav && bEsFav) return 1;
      return 0;
  });

  return (
    <div className="space-y-10 animate-fade-in">
      
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-gray-800 pb-8">
        <div>
            <h1 className="text-5xl md:text-6xl font-black italic uppercase text-white tracking-tighter mb-2">
            Categorías <span className="text-[#E10600]">Oficiales</span>
            </h1>
            <p className="text-gray-400 max-w-lg">
                Explora las series más emocionantes del automovilismo. Sigue tus favoritas para personalizar tu experiencia.
            </p>
        </div>

        {user && (
            <button 
                onClick={() => setVerSoloMisSuscripciones(!verSoloMisSuscripciones)}
                className={`flex items-center gap-3 px-6 py-3 rounded-full font-bold uppercase text-xs tracking-widest transition-all shadow-lg ${
                    verSoloMisSuscripciones 
                    ? "bg-[#E10600] text-white ring-2 ring-offset-2 ring-offset-black ring-[#E10600]" // Activo
                    : "bg-[#1E1E1E] text-gray-400 hover:text-white hover:bg-gray-800" // Inactivo
                }`}
            >
                {verSoloMisSuscripciones ? <Filter size={16} className="fill-white"/> : <Filter size={16}/>}
                {verSoloMisSuscripciones ? "Viendo Mis Suscripciones" : "Filtrar Mis Suscripciones"}
                {verSoloMisSuscripciones && <X size={16} className="ml-2"/>}
            </button>
        )}
      </div>

      {categoriasAVisualizar.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoriasAVisualizar.map(cat => {
            const esFavorita = misSuscripciones.includes(cat.id);
            
            return (
                <Link 
                to={`/categorias/${cat.id}`} 
                key={cat.id} 
                className="group relative h-96 rounded-2xl overflow-hidden bg-black border border-gray-800 shadow-2xl transition-all hover:-translate-y-2"
                >
                <img 
                    src={cat.foto_url} 
                    alt={cat.nombre} 
                    className={`w-full h-full object-cover transition-transform duration-700 ${esFavorita ? 'group-hover:scale-105' : 'grayscale group-hover:grayscale-0 group-hover:scale-110'}`} 
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
                
                {esFavorita && (
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-[#E10600]/50 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase flex items-center gap-2 shadow-lg z-10">
                        <div className="w-2 h-2 rounded-full bg-[#E10600] animate-pulse"></div>
                        Siguiendo
                    </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="flex items-center gap-2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0 duration-300">
                         <span className="text-[#E10600] text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                            <Trophy size={12}/> Ver Detalles
                         </span>
                    </div>
                    <h2 className="text-white font-black text-3xl md:text-4xl uppercase italic leading-none drop-shadow-lg group-hover:text-[#E10600] transition-colors">
                        {cat.nombre}
                    </h2>
                    <div className={`mt-4 h-1 rounded-full transition-all duration-500 ${esFavorita ? "w-1/3 bg-[#E10600]" : "w-12 bg-gray-600 group-hover:w-full group-hover:bg-white"}`}></div>
                </div>
                </Link>
            )
            })}
        </div>
      ) : (
          <div className="py-20 text-center border border-dashed border-gray-800 rounded-2xl bg-[#1E1E1E]/50">
              <Bell size={48} className="mx-auto text-gray-600 mb-4"/>
              <h3 className="text-2xl font-bold text-white mb-2">Aún no sigues ninguna categoría</h3>
              <p className="text-gray-400 mb-6">Suscríbete a tus favoritas para verlas aquí.</p>
              <button 
                onClick={() => setVerSoloMisSuscripciones(false)}
                className="text-[#E10600] font-bold uppercase text-sm hover:underline"
              >
                  Ver todas las categorías
              </button>
          </div>
      )}
    </div>
  )
}

export default Categorias 