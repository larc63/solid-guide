import { Component, type ReactNode } from 'react'
import { RouterProvider } from "react-router-dom";
import { router } from "./router/router";

import './App.css';

class App extends Component {
  render(): ReactNode {
    return (
      <div className="page-container">
        <RouterProvider router={router} />
      </div>
    )
  }
}

export default App
