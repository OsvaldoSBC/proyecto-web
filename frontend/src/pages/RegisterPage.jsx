import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

const RegisterPage = () => {
    const [formData, setFormData] = useState({username: '', email: '', password: ''})
    const navigate = useNavigate()
    
    // 1. Estado de carga (ya lo tenías, ahora lo usaremos)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        // 2. EVITAR DOBLE CLIC: Si ya está cargando, no hacemos nada
        if (loading) return

        setLoading(true) // Bloqueamos el botón

        try {
            // Nota: Asegúrate de que la URL coincida con tu backend (puede ser api/register/ o api/users/)
            await axios.post('http://127.0.0.1:8000/api/register/', formData)
            
            alert('Registro exitoso. Ahora inicia sesión.')
            navigate('/login')
        } catch (error) {
            console.error(error)
            // Mostramos un mensaje un poco más claro si es error de usuario duplicado
            if (error.response && error.response.data) {
                alert('Error: ' + JSON.stringify(error.response.data))
            } else {
                alert('Error al registrar. Revisa los datos.')
            }
        } finally {
            // 3. DESBLOQUEAR: Pase lo que pase (éxito o error), liberamos el botón
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center animate-fade-in">
             <div className="bg-[#1E1E1E] p-8 rounded-2xl border border-gray-800 shadow-2xl w-full max-w-md">
                <h2 className="text-3xl font-black italic uppercase text-white mb-6 text-center">
                    Crear <span className="text-[#E10600]">Cuenta</span>
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-400 text-sm font-bold mb-2 uppercase">Usuario</label>
                        <input 
                            type="text" 
                            required // Agregado para validación básica HTML
                            onChange={(e)=>setFormData({...formData, username:e.target.value})} 
                            className="w-full bg-black/30 border border-gray-700 rounded-lg p-3 text-white focus:border-[#E10600] outline-none" 
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm font-bold mb-2 uppercase">Email</label>
                        <input 
                            type="email" 
                            required
                            onChange={(e)=>setFormData({...formData, email:e.target.value})} 
                            className="w-full bg-black/30 border border-gray-700 rounded-lg p-3 text-white focus:border-[#E10600] outline-none" 
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm font-bold mb-2 uppercase">Contraseña</label>
                        <input 
                            type="password" 
                            required
                            onChange={(e)=>setFormData({...formData, password:e.target.value})} 
                            className="w-full bg-black/30 border border-gray-700 rounded-lg p-3 text-white focus:border-[#E10600] outline-none" 
                        />
                    </div>
                    
                    {/* 4. BOTÓN INTELIGENTE: Cambia según el estado loading */}
                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`w-full font-bold py-3 rounded-lg uppercase tracking-widest transition-colors ${
                            loading 
                                ? 'bg-gray-600 cursor-not-allowed text-gray-300' // Estilo Cargando
                                : 'bg-gray-700 hover:bg-[#E10600] text-white'     // Estilo Normal
                        }`}
                    >
                        {loading ? 'Procesando...' : 'Registrarse'}
                    </button>
                </form>
                 <div className="mt-6 text-center">
                    <p className="text-gray-500 text-sm">¿Ya tienes cuenta?</p>
                    <Link to="/login" className="text-white font-bold hover:text-[#E10600] uppercase text-sm">Inicia Sesión</Link>
                </div>
            </div>
        </div>
    )
}
export default RegisterPage