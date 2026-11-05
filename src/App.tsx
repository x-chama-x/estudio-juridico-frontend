import { useEffect, useState } from 'react'
import api from './services/api'

function App() {
  const [estado, setEstado] = useState('Consultando al backend...')

  useEffect(() => {
    api
      .get('/salud')
      .then((res) => setEstado(`Backend: ${res.data.status}`))
      .catch(() => setEstado('No se pudo conectar con el backend'))
  }, [])

  return <h1>{estado}</h1>
}

export default App