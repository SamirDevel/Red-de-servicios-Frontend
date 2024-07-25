import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { Provider } from 'react-redux'
import store from './store'

document.documentElement.style.height = '100%'
document.body.style.height = '100%'
document.getElementById('root').style.height = '100%'
ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
      <App />
    </Provider>
)
