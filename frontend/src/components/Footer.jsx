import { Link } from 'react-router-dom'
import { Flag, Facebook, Instagram, Twitter, Youtube, Mail, MapPin, Phone } from 'lucide-react'

function Footer() {
  return (
    <footer className="bg-[#1E1E1E] text-gray-300 border-t-4 border-[#E10600] pt-16 pb-8 mt-auto">
      <div className="container mx-auto px-4">
        
        {/* GRID PRINCIPAL (4 Columnas) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* COLUMNA 1: Marca y Misión */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group w-fit">
              <Flag className="text-[#E10600] w-8 h-8 group-hover:rotate-12 transition-transform" />
              <span className="text-2xl font-black italic text-white tracking-tighter">
                RACING<span className="text-[#E10600]">HUB</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              La plataforma #1 en Latinoamérica dedicada al automovilismo amateur. 
              Conectamos pilotos, equipos y aficionados sin intermediarios.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="bg-[#2A2A2A] p-2 rounded-full hover:bg-[#E10600] hover:text-white transition-all"><Instagram size={20} /></a>
              <a href="#" className="bg-[#2A2A2A] p-2 rounded-full hover:bg-[#E10600] hover:text-white transition-all"><Facebook size={20} /></a>
              <a href="#" className="bg-[#2A2A2A] p-2 rounded-full hover:bg-[#E10600] hover:text-white transition-all"><Youtube size={20} /></a>
            </div>
          </div>

          {/* COLUMNA 2: Enlaces Rápidos */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-wider mb-6 border-l-4 border-[#E10600] pl-3">Navegación</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/categorias" className="hover:text-[#E10600] transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#E10600] rounded-full"></span> Categorías
                </Link>
              </li>
              <li>
                <Link to="/noticias" className="hover:text-[#E10600] transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#E10600] rounded-full"></span> Noticias Recientes
                </Link>
              </li>
              <li>
                <Link to="/equipos" className="hover:text-[#E10600] transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#E10600] rounded-full"></span> Directorio de Equipos
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMNA 3: Legal (Placeholders) */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-wider mb-6 border-l-4 border-[#E10600] pl-3">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Términos y Condiciones</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Política de Privacidad</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Reglamento Deportivo 2026</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Trabaja con nosotros</a></li>
            </ul>
          </div>

          {/* COLUMNA 4: Contacto */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-wider mb-6 border-l-4 border-[#E10600] pl-3">Contacto</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="text-[#E10600] mt-1 shrink-0" size={18} />
                <span>Autódromo Hermanos Rodríguez,<br/>Ciudad de México, CDMX</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-[#E10600] shrink-0" size={18} />
                <span>contacto@racinghub.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-[#E10600] shrink-0" size={18} />
                <span>+52 (55) 1234-5678</span>
              </li>
            </ul>
          </div>

        </div>

        {/* BARRA INFERIOR (Copyright) */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© 2026 Racing Hub. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1">
            Diseñado con <span className="text-[#E10600]">velocidad</span> en México 🇲🇽
          </p>
        </div>

      </div>
    </footer>
  )
}

export default Footer