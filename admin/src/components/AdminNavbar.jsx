import React from 'react'
import { Link } from 'react-router-dom'
import { TicketIcon } from 'lucide-react'

const AdminNavbar = () => {
  return (
    <div className='flex items-center justify-between px-6 md:px-10 h-16 border-b border-white/10'>
        <Link to='/'>
            <div className='flex items-center text-2xl font-logo tracking-[0.2em]'>
                <span className='text-white'>Quick</span>
                <span className='text-primary'>Show</span>
            </div>
        </Link>
    </div>
  )
}

export default AdminNavbar
