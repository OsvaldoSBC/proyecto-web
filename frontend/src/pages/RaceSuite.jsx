import { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import { 
    Shield, Settings, Users, Save, Plus, Trash2, Edit2, X, 
    Globe, Twitter, Instagram, Facebook, Lock 
} from 'lucide-react'

function RaceSuite() {
  const { user, authTokens } = useContext(AuthContext)
  
  const [esManager, setEsManager] = useState(false)
  const [loading, setLoading] = useState(true)
  
  // Datos
  const [equipo, setEquipo] = useState(null)
  const [pilotos, setPilotos] = useState([])
  
  // UI State
  const [modoEdicionEquipo, setModoEdicionEquipo] = useState(false)
  const [pilotoEditando, setPilotoEditando] = useState(null)
  
  // Forms
  const [formEquipo, setFormEquipo] = useState({ web_oficial: '', twitter: '', instagram: '', facebook: '', logo_url: '' })
  const [formPiloto, setFormPiloto] = useState({ nombre: '', nacionalidad: '', foto_url: '' })

  // Carga de datos del equipo y validación de rol de Manager
  const cargarDatos = () => {
    if (user && authTokens) {
        axios.get('http://127.0.0.1:8000/api/race-suite-dashboard/', {
            headers: { 'Authorization': `Bearer ${authTokens.access}` }
        })
        .then(res => {
            setEsManager(true)
            setEquipo(res.data.equipo)
            setPilotos(res.data.pilotos)
            setFormEquipo({ 
                web_oficial: res.data.equipo.web_oficial || '', 
                twitter: res.data.equipo.twitter || '',
                instagram: res.data.equipo.instagram || '',
                facebook: res.data.equipo.facebook || '',
                logo_url: res.data.equipo.logo_url || ''
            })
            setLoading(false)
        })
        .catch(() => { setEsManager(false); setLoading(false); })
    } else { setLoading(false) }
  }

  useEffect(() => { cargarDatos() }, [user, authTokens])

  // Actualización de datos del equipo
  const guardarEquipo = async (e) => {
      e.preventDefault()
      try {
          await axios.put('http://127.0.0.1:8000/api/race-suite-dashboard/', formEquipo, {
            headers: { 'Authorization': `Bearer ${authTokens.access}` }
          })
          alert("Equipo actualizado")
          setModoEdicionEquipo(false)
          cargarDatos()
      } catch(e) { console.error(e) }
  }

  // Gestión de Pilotos (Crear / Editar)
  const guardarPiloto = async (e) => {
      e.preventDefault()
      try {
          if (pilotoEditando) {
              await axios.put(`http://127.0.0.1:8000/api/race-suite-piloto/${pilotoEditando}/`, formPiloto, {
                  headers: { 'Authorization': `Bearer ${authTokens.access}` }
              })
              alert("Piloto modificado")
          } else {
              await axios.post('http://127.0.0.1:8000/api/race-suite-dashboard/', formPiloto, {
                  headers: { 'Authorization': `Bearer ${authTokens.access}` }
              })
              alert("Piloto fichado")
          }
          // Reset
          setPilotoEditando(null)
          setFormPiloto({ nombre: '', nacionalidad: '', foto_url: '' })
          cargarDatos()
      } catch(e) { console.error(e) }
  }

  const eliminarPiloto = async (id) => {
      if(!window.confirm("¿Despedir a este piloto? Esta acción es irreversible.")) return;
      try {
          await axios.delete(`http://127.0.0.1:8000/api/race-suite-piloto/${id}/`, {
            headers: { 'Authorization': `Bearer ${authTokens.access}` }
          })
          cargarDatos()
      } catch(e) { console.error(e) }
  }

  const prepararEdicionPiloto = (piloto) => {
      setPilotoEditando(piloto.id)
      setFormPiloto({
          nombre: piloto.nombre,
          nacionalidad: piloto.nacionalidad,
          foto_url: piloto.foto_url
      })
  }

  // Vista de acceso denegado (No Manager)
  if (!esManager || !user) {
      return (
           <div className="text-center py-20 animate-fade-in">
                <Shield size={64} className="mx-auto text-[#E10600] mb-6"/>
                <h1 className="text-5xl font-black italic uppercase text-white mb-4">Race Suite</h1>
                <p className="text-gray-400 mb-8">Acceso exclusivo para Jefes de Equipo.</p>
                {!user ? (
                    <Link to="/login" className="bg-[#E10600] text-white px-8 py-3 rounded-full font-bold uppercase">Iniciar Sesión</Link>
                ) : (
                    <div className="bg-yellow-900/30 border border-yellow-700 text-yellow-200 p-4 rounded-xl max-w-md mx-auto">
                        <p className="font-bold">Usuario detectado: {user.username}</p>
                        <p className="text-sm mt-2">No tienes un equipo asignado.</p>
                    </div>
                )}
           </div>
      )
  }

  // Vista del Dashboard (Manager)
  return (
    <div className="animate-fade-in pb-20">
        
        <div className="flex items-center justify-between mb-10 border-b border-gray-800 pb-6">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-lg p-2 overflow-hidden shadow-lg">
                    {equipo.logo_url ? (
                        <img src={equipo.logo_url} alt="Logo" className="w-full h-full object-contain"/>
                    ) : (
                        <Shield className="w-full h-full text-gray-400"/>
                    )}
                </div>
                <div>
                    <h1 className="text-3xl font-black italic uppercase text-white">{equipo.nombre}</h1>
                    <div className="flex gap-2 mt-1">
                        {equipo.web_oficial && <a href={equipo.web_oficial} target="_blank" className="text-gray-400 hover:text-white"><Globe size={16}/></a>}
                        {equipo.twitter && <a href={`https://twitter.com/${equipo.twitter}`} target="_blank" className="text-gray-400 hover:text-[#1DA1F2]"><Twitter size={16}/></a>}
                        {equipo.instagram && <a href={`https://instagram.com/${equipo.instagram}`} target="_blank" className="text-gray-400 hover:text-[#E4405F]"><Instagram size={16}/></a>}
                        {equipo.facebook && <a href={equipo.facebook} target="_blank" className="text-gray-400 hover:text-[#1877F2]"><Facebook size={16}/></a>}
                    </div>
                </div>
            </div>
            
            <button 
                onClick={() => setModoEdicionEquipo(!modoEdicionEquipo)} 
                className={`p-3 rounded-full transition-all ${modoEdicionEquipo ? "bg-[#E10600] text-white rotate-90" : "bg-gray-800 text-gray-400 hover:text-white"}`}
                title="Editar Datos del Equipo"
            >
                <Settings size={24}/>
            </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            {modoEdicionEquipo && (
                <div className="bg-[#1E1E1E] p-8 rounded-2xl border border-gray-800 animate-fade-in-up h-fit">
                    <h2 className="text-xl font-bold text-white uppercase mb-6 flex items-center gap-2">
                        <Edit2 size={20} className="text-[#E10600]"/> Editar Identidad
                    </h2>
                    <form onSubmit={guardarEquipo} className="space-y-4">
                        <div>
                            <label className="text-gray-500 text-[10px] uppercase font-bold">Logo URL</label>
                            <input type="text" value={formEquipo.logo_url} onChange={(e) => setFormEquipo({...formEquipo, logo_url: e.target.value})} className="w-full bg-black/30 border border-gray-700 rounded p-2 text-white text-sm outline-none focus:border-[#E10600]"/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-gray-500 text-[10px] uppercase font-bold">Sitio Web</label>
                                <input type="text" value={formEquipo.web_oficial} onChange={(e) => setFormEquipo({...formEquipo, web_oficial: e.target.value})} className="w-full bg-black/30 border border-gray-700 rounded p-2 text-white text-sm outline-none focus:border-[#E10600]"/>
                            </div>
                            <div>
                                <label className="text-gray-500 text-[10px] uppercase font-bold">Twitter (Usuario)</label>
                                <input type="text" value={formEquipo.twitter} onChange={(e) => setFormEquipo({...formEquipo, twitter: e.target.value})} className="w-full bg-black/30 border border-gray-700 rounded p-2 text-white text-sm outline-none focus:border-[#E10600]"/>
                            </div>
                            <div>
                                <label className="text-gray-500 text-[10px] uppercase font-bold">Instagram (Usuario)</label>
                                <input type="text" value={formEquipo.instagram} onChange={(e) => setFormEquipo({...formEquipo, instagram: e.target.value})} className="w-full bg-black/30 border border-gray-700 rounded p-2 text-white text-sm outline-none focus:border-[#E10600]"/>
                            </div>
                            <div>
                                <label className="text-gray-500 text-[10px] uppercase font-bold">Facebook URL</label>
                                <input type="text" value={formEquipo.facebook} onChange={(e) => setFormEquipo({...formEquipo, facebook: e.target.value})} className="w-full bg-black/30 border border-gray-700 rounded p-2 text-white text-sm outline-none focus:border-[#E10600]"/>
                            </div>
                        </div>
                        <p className="text-gray-600 text-xs italic">* Deja los campos vacíos si no quieres mostrarlos.</p>
                        <button type="submit" className="bg-white text-black hover:bg-gray-200 w-full py-3 rounded-lg font-bold uppercase text-xs tracking-widest flex items-center justify-center gap-2 mt-4">
                            <Save size={16}/> Guardar Cambios
                        </button>
                    </form>
                </div>
            )}

            <div className={`bg-[#1E1E1E] p-8 rounded-2xl border border-gray-800 ${!modoEdicionEquipo ? 'lg:col-span-2' : ''}`}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white uppercase flex items-center gap-2">
                        <Users size={20} className="text-[#E10600]"/> Plantilla de Pilotos
                    </h2>
                </div>

                <div className="bg-black/20 p-6 rounded-xl border border-gray-700 mb-8">
                    <h3 className="text-white text-xs font-bold uppercase mb-4 flex items-center gap-2">
                        {pilotoEditando ? <><Edit2 size={14}/> Editando Piloto</> : <><Plus size={14}/> Nuevo Fichaje</>}
                    </h3>
                    <form onSubmit={guardarPiloto} className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-grow w-full">
                            <input type="text" placeholder="Nombre Completo" required value={formPiloto.nombre} onChange={e => setFormPiloto({...formPiloto, nombre: e.target.value})} className="w-full bg-[#1E1E1E] text-white p-3 rounded border border-gray-700 text-sm outline-none focus:border-[#E10600]"/>
                        </div>
                        <div className="w-full md:w-32">
                            <input type="text" placeholder="Nac (MEX)" required value={formPiloto.nacionalidad} onChange={e => setFormPiloto({...formPiloto, nacionalidad: e.target.value})} className="w-full bg-[#1E1E1E] text-white p-3 rounded border border-gray-700 text-sm outline-none focus:border-[#E10600]"/>
                        </div>
                        <div className="w-full md:w-64">
                            <input type="text" placeholder="URL Foto" value={formPiloto.foto_url} onChange={e => setFormPiloto({...formPiloto, foto_url: e.target.value})} className="w-full bg-[#1E1E1E] text-white p-3 rounded border border-gray-700 text-sm outline-none focus:border-[#E10600]"/>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <button type="submit" className="bg-[#E10600] hover:bg-red-700 text-white px-6 py-3 rounded font-bold uppercase text-xs tracking-widest transition-colors flex-grow md:flex-grow-0">
                                {pilotoEditando ? "Actualizar" : "Agregar"}
                            </button>
                            {pilotoEditando && (
                                <button type="button" onClick={() => {setPilotoEditando(null); setFormPiloto({nombre:'', nacionalidad:'', foto_url:''})}} className="bg-gray-700 text-white px-4 py-3 rounded hover:bg-gray-600">
                                    <X size={16}/>
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pilotos.map(piloto => (
                        <div key={piloto.id} className="flex items-center gap-4 bg-[#121212] p-4 rounded-xl border border-gray-800 hover:border-gray-600 transition-all group">
                            <div className="w-12 h-12 rounded-full bg-gray-700 overflow-hidden flex-shrink-0">
                                <img src={piloto.foto_url || "https://via.placeholder.com/100"} className="w-full h-full object-cover"/>
                            </div>
                            <div className="flex-grow min-w-0">
                                <h4 className="text-white font-bold truncate">{piloto.nombre}</h4>
                                <span className="text-gray-500 text-xs uppercase font-bold bg-gray-900 px-2 py-0.5 rounded">{piloto.nacionalidad}</span>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => prepararEdicionPiloto(piloto)} className="text-gray-400 hover:text-white bg-gray-800 p-2 rounded-lg"><Edit2 size={16}/></button>
                                <button onClick={() => eliminarPiloto(piloto.id)} className="text-gray-400 hover:text-red-500 bg-gray-800 p-2 rounded-lg"><Trash2 size={16}/></button>
                            </div>
                        </div>
                    ))}
                    {pilotos.length === 0 && <p className="text-gray-500 text-center col-span-2 py-4 italic">No hay pilotos registrados en la escudería.</p>}
                </div>
            </div>

        </div>
    </div>
  )
}

export default RaceSuite