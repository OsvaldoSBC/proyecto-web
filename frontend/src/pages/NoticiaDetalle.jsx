import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { ChevronLeft, Calendar, User, Trophy, Flag } from 'lucide-react'

function NoticiaDetalle() {
  const { id } = useParams()
  const [nota, setNota] = useState(null)

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/noticias/${id}/`)
      .then(res => setNota(res.data))
      .catch(err => console.error(err))
  }, [id])

  if (!nota) return <div className="text-white text-center py-20">Cargando noticia...</div>

  const formatearFecha = (fechaString) => {
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(fechaString).toLocaleDateString('es-MX', opciones)
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      
      {/* Botón Volver */}
      <Link to="/noticias" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
        <ChevronLeft size={20} /> Volver a Noticias
      </Link>

      {/* Tags de Contexto */}
      <div className="flex flex-wrap gap-3 mb-4">
        {nota.nombre_organizacion && (
          <span className="flex items-center gap-1 text-[#E10600] font-bold text-xs uppercase tracking-widest border border-[#E10600] px-3 py-1 rounded-full">
            <Flag size={12} /> {nota.nombre_organizacion}
          </span>
        )}
        {nota.nombre_categoria && (
          <span className="flex items-center gap-1 text-yellow-500 font-bold text-xs uppercase tracking-widest border border-yellow-500 px-3 py-1 rounded-full">
            <Trophy size={12} /> {nota.nombre_categoria}
          </span>
        )}
        {nota.nombre_equipo && (
          <span className="flex items-center gap-1 text-blue-400 font-bold text-xs uppercase tracking-widest border border-blue-400 px-3 py-1 rounded-full">
            <User size={12} /> {nota.nombre_equipo}
          </span>
        )}
      </div>

      {/* Título y Fecha */}
      <h1 className="text-4xl md:text-6xl font-black italic text-white uppercase leading-tight mb-4">
        {nota.titulo}
      </h1>
      <div className="flex items-center gap-2 text-gray-400 font-mono text-sm mb-8">
        <Calendar size={16} /> {formatearFecha(nota.fecha)}
      </div>

      {/* Imagen Principal */}
      <div className="w-full aspect-video rounded-2xl overflow-hidden mb-10 shadow-2xl">
        <img src={nota.imagen_url} alt={nota.titulo} className="w-full h-full object-cover" />
      </div>

      {/* CUERPO DE LA NOTICIA */}
      {/* whitespace-pre-line respeta los saltos de línea que hagas en el Admin */}
      <div className="prose prose-invert prose-lg max-w-none text-gray-300 whitespace-pre-line leading-relaxed">
        {nota.cuerpo}
      </div>

    </div>
  )
}

export default NoticiaDetalle