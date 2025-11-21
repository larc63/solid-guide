import { useState } from 'react'

import TODOList from './TODOList'

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <TODOList />
      </div>
    </>
  )
}

export default App
