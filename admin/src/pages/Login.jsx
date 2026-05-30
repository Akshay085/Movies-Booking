import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { LockIcon, MailIcon, Eye, EyeOff } from 'lucide-react'
import BlurCircle from '../components/BlurCircle'

const Login = () => {
  const { loginAdmin } = useAppContext()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    loginAdmin(email, password)
  }

  return (
    <div className='relative flex items-center justify-center min-h-[calc(100vh-64px)] w-full overflow-hidden bg-background'>
      <BlurCircle top='-50px' left='-50px' />
      <BlurCircle bottom='-50px' right='-50px' />
      
      <div className='relative w-full max-w-md p-8 bg-surface/50 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl mx-4 z-10'>
        <div className='flex flex-col items-center mb-8'>
          <div className='flex items-center text-3xl font-logo tracking-[0.2em] mb-2'>
            <span className='text-primary'>AVR</span>
            <span className='text-white'>Theater</span>
          </div>
          <p className='text-gray-400 text-sm'>Admin Control Panel</p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label className='block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2'>Email Address</label>
            <div className='flex items-center gap-3 border border-primary/20 bg-primary/5 px-4 py-3 rounded-xl focus-within:border-primary/50 transition-all'>
              <MailIcon className='w-5 h-5 text-primary/60' />
              <input 
                type='email' 
                required 
                placeholder='admin@example.com' 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='bg-transparent outline-none flex-1 text-white text-sm'
              />
            </div>
          </div>

          <div>
            <label className='block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2'>Password</label>
            <div className='flex items-center gap-3 border border-primary/20 bg-primary/5 px-4 py-3 rounded-xl focus-within:border-primary/50 transition-all'>
              <LockIcon className='w-5 h-5 text-primary/60' />
              <input 
                type={showPassword ? 'text' : 'password'} 
                required 
                placeholder='••••••••' 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='bg-transparent outline-none flex-1 text-white text-sm'
              />
              <button 
                type='button' 
                onClick={() => setShowPassword(!showPassword)}
                className='text-primary/60 hover:text-primary transition-colors focus:outline-none cursor-pointer'
              >
                {showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
              </button>
            </div>
          </div>

          <button 
            type='submit' 
            className='w-full py-4 bg-primary hover:bg-primary-dull text-black font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-primary/20 cursor-pointer mt-4'
          >
            Access Dashboard
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
