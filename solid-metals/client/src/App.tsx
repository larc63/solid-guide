import { Component, type ReactNode } from 'react'

import './App.css'

import Metals from './Metals'

class App extends Component{
  render(): ReactNode {
    return (
      <>
        <div className='appContainer'>
          <Metals />
        </div>
      </>
    )
  }
}

export default App
