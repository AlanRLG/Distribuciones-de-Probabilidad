import { useEffect } from 'react'
import axios from 'axios'
import BernoulliDistribution  from './components/BernoulliDistribution'

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
    <BernoulliDistribution />
  )
}

export default App