import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [elementos, setElementos] = useState([])

  useEffect(() => {
    // Aquí conectamos con tu Django
    axios.get('http://127.0.0.1:8000/api/elementos/')
      .then(response => {
        setElementos(response.data)
      })
      .catch(error => console.error("Error:", error))
  }, [])

  // --- AQUÍ EMPIEZA TU HTML ---
  return (
    <div className="contenedor">
      <header>
        <h1>🔥 Mi Proyecto Profesional</h1>
        <p>Desarrollado con Django y React</p>
      </header>

      <main className="grid">
        {elementos.map((item) => (
          <div key={item.id} className="tarjeta">
            <h2>{item.titulo}</h2>
            <p>{item.descripcion}</p>
          </div>
        ))}
      </main>
    </div>
  )
}

export default App
