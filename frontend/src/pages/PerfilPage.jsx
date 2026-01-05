import { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import AuthContext from '../context/AuthContext'
import { User, Mail, Save, Edit2, Trash2, Shield, Calendar, X } from 'lucide-react'

function PerfilPage() {
  const { authTokens, logoutUser } = useContext(AuthContext)
  
  const [perfil, setPerfil] = useState({ username: '', email: '', fecha_unido: '' })
  const [modoEdicion, setModoEdicion] = useState(false)
  const [formData, setFormData] = useState({ username: '', email: '' })
  const [mensaje, setMensaje] = useState(null)

  // Carga de datos del perfil
  useEffect(() => {
    cargarPerfil()
  }, [])

  const cargarPerfil = async () => {
    try {
        const res = await axios.get('http://127.0.0.1:8000/api/mi-perfil/', {
            headers: { 'Authorization': `Bearer ${authTokens.access}` }
        })
        setPerfil(res.data)
        setFormData({ username: res.data.username, email: res.data.email })
    } catch (error) {
        console.error("Error cargando perfil", error)
    }
  }

  // Actualización de información de usuario
  const handleUpdate = async (e) => {
    e.preventDefault()
    setMensaje(null)
    try {
        await axios.put('http://127.0.0.1:8000/api/mi-perfil/', formData, {
            headers: { 'Authorization': `Bearer ${authTokens.access}` }
        })
        setModoEdicion(false)
        cargarPerfil() // Recargar datos frescos
        alert("Perfil actualizado con éxito")
    } catch (error) {
        console.error(error)
        setMensaje("Error: El nombre de usuario podría estar ocupado.")
    }
  }

  // Eliminación permanente de la cuenta
  const handleDelete = async () => {
    const confirmacion = window.confirm("¿ESTÁS SEGURO? Esta acción no se puede deshacer. Se borrará tu cuenta y tus suscripciones.")
    
    if (confirmacion) {
        try {
            await axios.delete('http://127.0.0.1:8000/api/mi-perfil/', {
                headers: { 'Authorization': `Bearer ${authTokens.access}` }
            })
            alert("Tu cuenta ha sido eliminada. Te extrañaremos.")
            logoutUser() // Cerrar sesión y redirigir
        } catch (error) {
            console.error("Error eliminando cuenta", error)
            alert("No se pudo eliminar la cuenta.")
        }
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-10 animate-fade-in">
      
      <h1 className="text-4xl font-black italic uppercase text-white mb-2 text-center">Mi <span className="text-[#E10600]">Perfil</span></h1>
      <p className="text-gray-400 text-center mb-10">Gestiona tu información personal y cuenta.</p>

      {/* TARJETA PRINCIPAL */}
      <div className="bg-[#1E1E1E] rounded-2xl p-8 border border-gray-800 shadow-2xl relative overflow-hidden">
        
        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <User size={150} />
        </div>

        {mensaje && (
            <div className="bg-red-900/50 text-red-200 p-3 rounded mb-4 text-sm border border-red-800">
                {mensaje}
            </div>
        )}

        {modoEdicion ? (
            // --- FORMULARIO DE EDICIÓN ---
            <form onSubmit={handleUpdate} className="space-y-6 relative z-10">
                <div>
                    <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Nombre de Usuario</label>
                    <div className="flex items-center gap-3 bg-black/40 p-3 rounded-lg border border-gray-600 focus-within:border-[#E10600] transition-colors">
                        <User size={20} className="text-gray-500"/>
                        <input 
                            type="text" 
                            value={formData.username}
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                            className="bg-transparent text-white w-full outline-none font-bold"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Correo Electrónico</label>
                    <div className="flex items-center gap-3 bg-black/40 p-3 rounded-lg border border-gray-600 focus-within:border-[#E10600] transition-colors">
                        <Mail size={20} className="text-gray-500"/>
                        <input 
                            type="email" 
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="bg-transparent text-white w-full outline-none font-bold"
                        />
                    </div>
                </div>

                <div className="flex gap-4 pt-4">
                    <button type="submit" className="flex-1 bg-[#E10600] hover:bg-red-700 text-white py-3 rounded-lg font-bold uppercase flex items-center justify-center gap-2 transition-all">
                        <Save size={18}/> Guardar Cambios
                    </button>
                    <button type="button" onClick={() => {setModoEdicion(false); setMensaje(null)}} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-bold uppercase flex items-center justify-center gap-2 transition-all">
                        <X size={18}/> Cancelar
                    </button>
                </div>
            </form>
        ) : (
            // --- VISTA DE LECTURA ---
            <div className="space-y-8 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-gray-700 to-black w-20 h-20 rounded-full flex items-center justify-center border-2 border-[#E10600] shadow-lg">
                        <User size={40} className="text-white"/>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">{perfil.username}</h2>
                        <span className="bg-gray-800 text-gray-300 text-[10px] px-2 py-1 rounded uppercase font-bold tracking-wider">Piloto Registrado</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-700 pt-6">
                    <div>
                        <span className="block text-gray-500 text-xs font-bold uppercase mb-1">Email</span>
                        <div className="flex items-center gap-2 text-white">
                            <Mail size={16} className="text-[#E10600]"/> {perfil.email}
                        </div>
                    </div>
                    <div>
                        <span className="block text-gray-500 text-xs font-bold uppercase mb-1">Miembro desde</span>
                        <div className="flex items-center gap-2 text-white">
                            <Calendar size={16} className="text-[#E10600]"/> {new Date(perfil.fecha_unido).toLocaleDateString()}
                        </div>
                    </div>
                </div>

                <button 
                    onClick={() => setModoEdicion(true)} 
                    className="w-full border border-gray-600 hover:border-white text-gray-300 hover:text-white py-3 rounded-lg font-bold uppercase flex items-center justify-center gap-2 transition-all"
                >
                    <Edit2 size={16}/> Editar Perfil
                </button>
            </div>
        )}
      </div>

      {/* ZONA DE PELIGRO */}
      <div className="mt-12 border border-red-900/30 bg-red-900/10 p-6 rounded-2xl">
          <div className="flex items-start gap-4">
              <div className="bg-red-900/20 p-3 rounded-full">
                  <Shield size={24} className="text-[#E10600]"/>
              </div>
              <div className="flex-grow">
                  <h3 className="text-white font-bold uppercase">Zona de Peligro</h3>
                  <p className="text-gray-400 text-sm mb-4 mt-1">
                      Si eliminas tu cuenta, perderás todas tus suscripciones y preferencias. Esta acción no se puede deshacer.
                  </p>
                  <button 
                    onClick={handleDelete}
                    className="text-red-500 hover:text-red-400 text-sm font-bold uppercase flex items-center gap-2 hover:underline"
                  >
                      <Trash2 size={16}/> Eliminar mi cuenta permanentemente
                  </button>
              </div>
          </div>
      </div>

    </div>
  )
}

export default PerfilPage