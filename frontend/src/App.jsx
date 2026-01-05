import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Categorias from './pages/Categorias'
import CategoriaDetalle from './pages/CategoriaDetalle'
import Equipos from './pages/Equipos'
import Noticias from './pages/Noticias'
import NoticiaDetalle from './pages/NoticiaDetalle'
import PerfilPage from './pages/PerfilPage'
import AboutUs from './pages/AboutUs'   
import RaceSuite from './pages/RaceSuite'
import LoginPage from './pages/LoginPage' 
import RegisterPage from './pages/RegisterPage'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <div className="min-h-screen bg-[#121212]">
      {/* ENVUELVE TODO CON AUTHPROVIDER */}
      <AuthProvider> 
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categorias" element={<Categorias />} />
            <Route path="/categorias/:id" element={<CategoriaDetalle />} />
            <Route path="/equipos" element={<Equipos />} />
            <Route path="/noticias" element={<Noticias />} />
            <Route path="/noticias/:id" element={<NoticiaDetalle />} />
            <Route path="/perfil" element={<PerfilPage />} />
            <Route path="/about" element={<AboutUs />} />      
            <Route path="/race-suite" element={<RaceSuite />} /> 
            {/* RUTAS DE AUTH */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </main>
        <Footer />
      </AuthProvider>
    </div>
  )
}

export default App