import { Component, type ReactNode } from 'react'
import OrderList from './OrderList'


// import css
import './App.css'

class App extends Component{
  render(): ReactNode {
    return (
      <>
        <div> <h1>Create Order</h1>
        Order form goes here
        <h1>Current Orders</h1>
          <OrderList />
        </div>
      </>
    )
  }
}

export default App
