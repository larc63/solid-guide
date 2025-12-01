import { Component, type ReactNode } from 'react'

// import components
import OrderList from './OrderList'
import OrderForm from './OrderForm'

// import css
import './App.css'

class App extends Component{
  render(): ReactNode {
    return (
      <>
        <OrderList />
      </>
    )
  }
}

export default App
