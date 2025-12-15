import { Component, type ReactNode } from 'react'

import TODOList from './TODOList'

import './App.css'

class App extends Component{
  render(): ReactNode {
    return (
      <>
        <div className='appContainer'>
          <TODOList />
        </div>
      </>
    )
  }
}

export default App
