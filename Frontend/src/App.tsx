import { useEffect } from 'react'
import axios from 'axios'

function App() {

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/')
      .then(response => {
        console.log(response.data)
      })
      .catch(error => {
        console.error(error)
      })
  }, [])

  return (
    <h1>Distribuciones de Probabilidad</h1>
  )
}

export default App