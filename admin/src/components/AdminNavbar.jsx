import React from 'react'
import { Link } from 'react-router-dom'
import { LogOutIcon } from 'lucide-react'
import { useAppContext } from '../context/AppContext'

const AdminNavbar = () => {
  const { logoutAdmin, isAdminAuthenticated } = useAppContext()

  return (
    <div className='flex items-center justify-between px-6 md:px-10 h-16 border-b border-white/10'>
        <Link to='/'>
            <div className='flex items-center text-2xl font-logo tracking-[0.2em]'>
                <span className='text-primary'>AVR</span>
                <span className='text-white'>Theater</span> 
            </div>
        </Link>
        {isAdminAuthenticated && (
          <button 
            onClick={logoutAdmin}
            className='flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-primary/20 transition-all cursor-pointer'
          >
            <LogOutIcon className='w-4 h-4' />
            Logout
          </button>
        )}
    </div>
  )
}

export default AdminNavbar
