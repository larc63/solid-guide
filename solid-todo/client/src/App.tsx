import { Component, type ReactNode } from 'react'

import TODOList from './TODOList'

import './App.css'

class App extends Component{
  render(): ReactNode {
    return (
      <>
        <div>
          <TODOList />
        </div>
      </>
    )
  }
}

export default App
