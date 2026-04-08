import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from '@clerk/react'

const publicekey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if(!publicekey){
  throw new Error('Public key is not defined in environment variables')
}

createRoot(document.getElementById('root')).render(
  <ClerkProvider publishableKey={publicekey}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ClerkProvider>
)
