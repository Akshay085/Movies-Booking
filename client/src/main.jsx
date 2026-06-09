import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from '@clerk/react'
import { AppProvider } from './context/AppContext.jsx'

const publicekey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if(!publicekey){
  throw new Error('Public key is not defined in environment variables')
}

createRoot(document.getElementById('root')).render(
  <ClerkProvider publishableKey={publicekey}>
    <BrowserRouter>
      <AppProvider>
        <App />
      </AppProvider>
    </BrowserRouter>
  </ClerkProvider>
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => console.log('Service worker registered successfully', reg))
      .catch((err) => console.error('Service worker registration failed', err));
  });
}

