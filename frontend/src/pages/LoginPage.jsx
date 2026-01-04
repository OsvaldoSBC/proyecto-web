import { useContext } from 'react'
import AuthContext from '../context/AuthContext'
import { Link } from 'react-router-dom'

const LoginPage = () => {
    let { loginUser } = useContext(AuthContext)
    
    return (
        <div className="min-h-screen flex items-center justify-center animate-fade-in">
            <div className="bg-[#1E1E1E] p-8 rounded-2xl border border-gray-800 shadow-2xl w-full max-w-md">
                <h2 className="text-3xl font-black italic uppercase text-white mb-6 text-center">
                    Iniciar <span className="text-[#E10600]">Sesión</span>
                </h2>
                <form onSubmit={loginUser} className="space-y-6">
                    <div>
                        <label className="block text-gray-400 text-sm font-bold mb-2 uppercase">Usuario</label>
                        <input type="text" name="username" placeholder="Tu usuario" className="w-full bg-black/30 border border-gray-700 rounded-lg p-3 text-white focus:border-[#E10600] outline-none" />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm font-bold mb-2 uppercase">Contraseña</label>
                        <input type="password" name="password" placeholder="••••••" className="w-full bg-black/30 border border-gray-700 rounded-lg p-3 text-white focus:border-[#E10600] outline-none" />
                    </div>
                    <button type="submit" className="w-full bg-[#E10600] hover:bg-red-700 text-white font-bold py-3 rounded-lg uppercase tracking-widest transition-colors">
                        Entrar a Pits
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <p className="text-gray-500 text-sm">¿No tienes cuenta?</p>
                    <Link to="/register" className="text-white font-bold hover:text-[#E10600] uppercase text-sm">Regístrate Aquí</Link>
                </div>
            </div>
        </div>
    )
}
export default LoginPage