import { useState, useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Flag, User, LogOut, LogIn } from 'lucide-react'
import AuthContext from '../context/AuthContext' // <--- 1. IMPORTAMOS EL CONTEXTO

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  
  // 2. SACAMOS EL USUARIO Y LA FUNCIÓN LOGOUT DEL CEREBRO
  const { user, logoutUser } = useContext(AuthContext)

  const isActive = (path) => {
    return location.pathname === path ? "text-[#E10600]" : "text-white hover:text-[#E10600]"
  }

  return (
    <nav className="bg-black/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          
          {/* LOGO */}
          <Link to="/" className="text-2xl font-black italic tracking-tighter text-white flex items-center gap-2">
            <Flag className="text-[#E10600]" />
            RACING<span className="text-[#E10600]">HUB</span>
          </Link>

          {/* MENÚ ESCRITORIO (Centro) */}
          <div className="hidden md:flex space-x-8 font-bold uppercase text-sm tracking-wider">
            <Link to="/" className={`${isActive('/')} transition-colors`}>Inicio</Link>
            <Link to="/noticias" className={`${isActive('/noticias')} transition-colors`}>Noticias</Link>
            <Link to="/categorias" className={`${isActive('/categorias')} transition-colors`}>Categorías</Link>
            <Link to="/equipos" className={`${isActive('/equipos')} transition-colors`}>Equipos</Link>
          </div>

          {/* ZONA DE USUARIO (Derecha) */}
          <div className="hidden md:flex items-center gap-4">
            
            {user ? (
              // --- SI ESTÁ LOGUEADO ---
              <div className="flex items-center gap-4 animate-fade-in">
                <div className="flex items-center gap-2 text-white font-bold text-sm uppercase">
                    <div className="bg-[#E10600] p-1 rounded-full">
                        <User size={16} fill="white" />
                    </div>
                    {/* Si el token trae username lo muestra, si no dice "Piloto" */}
                    <span>Hola, {user.username || "Piloto"}</span>
                </div>
                
                <button 
                    onClick={logoutUser} 
                    className="flex items-center gap-2 text-gray-400 hover:text-white text-xs font-bold uppercase transition-colors border border-gray-700 hover:border-white px-3 py-1.5 rounded-full"
                >
                    <LogOut size={14} /> Salir
                </button>
              </div>
            ) : (
              // --- SI NO ESTÁ LOGUEADO ---
              <div className="flex items-center gap-4 animate-fade-in">
                <Link to="/login" className="text-gray-300 hover:text-white text-sm font-bold uppercase transition-colors">
                  Login
                </Link>
                <Link to="/register" className="bg-[#E10600] hover:bg-red-700 text-white px-5 py-2 rounded-full font-bold uppercase text-xs tracking-widest transition-all shadow-[0_0_10px_rgba(225,6,0,0.4)] flex items-center gap-2">
                  <User size={16} /> Únete
                </Link>
              </div>
            )}

          </div>

          {/* BOTÓN MENÚ MÓVIL */}
          <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* MENÚ MÓVIL DESPLEGABLE */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-800 space-y-4 animate-fade-in">
            <Link to="/" className="block text-white font-bold uppercase py-2 hover:text-[#E10600]" onClick={() => setIsOpen(false)}>Inicio</Link>
            <Link to="/noticias" className="block text-white font-bold uppercase py-2 hover:text-[#E10600]" onClick={() => setIsOpen(false)}>Noticias</Link>
            <Link to="/categorias" className="block text-white font-bold uppercase py-2 hover:text-[#E10600]" onClick={() => setIsOpen(false)}>Categorías</Link>
            <Link to="/equipos" className="block text-white font-bold uppercase py-2 hover:text-[#E10600]" onClick={() => setIsOpen(false)}>Equipos</Link>
            
            <div className="border-t border-gray-800 pt-4">
              {user ? (
                 <>
                    <div className="flex items-center gap-2 text-white font-bold mb-4">
                        <User size={18} className="text-[#E10600]" /> {user.username || "Piloto"}
                    </div>
                    <button onClick={() => {logoutUser(); setIsOpen(false)}} className="w-full text-left text-gray-400 hover:text-white font-bold uppercase flex items-center gap-2">
                        <LogOut size={18} /> Cerrar Sesión
                    </button>
                 </>
              ) : (
                 <div className="flex flex-col gap-3">
                    <Link to="/login" className="text-center w-full border border-gray-700 text-white py-2 rounded font-bold uppercase" onClick={() => setIsOpen(false)}>
                        Iniciar Sesión
                    </Link>
                    <Link to="/register" className="text-center w-full bg-[#E10600] text-white py-2 rounded font-bold uppercase" onClick={() => setIsOpen(false)}>
                        Registrarse
                    </Link>
                 </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar