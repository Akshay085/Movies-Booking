import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { MenuIcon, SearchIcon, TicketIcon, TicketPlus, XIcon } from 'lucide-react'
import { useClerk, useUser , UserButton } from '@clerk/react'

const Navbar = () => {
    const [isOpen , setIsOpen] = useState(false)
    const {user} = useUser()
    const {openSignIn} = useClerk()

    const navigate = useNavigate()

  return (
    <div className='fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5'>
        <Link to='/' className='max-md:flex-1'>
            <div className='flex items-center text-2xl tracking-[0.2em] font-logo'>
                <span className='text-primary'>AVR</span>
                <span className='text-white'>Theater</span>
            </div>
        </Link>
        
        <div className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-serif max-md:text-xl z-50 flex flex-col 
        md:flex-row items-center max-md:justify-center gap-10 min-md:px-10 py-3 max-md:h-screen min-md:rounded-full backdrop-blur-lg 
        bg-black/80 md:bg-white/5 md:border border-white/10 overflow-hidden transition-all duration-500 shadow-2xl
        ${isOpen ? 'max-md:w-full opacity-100' : 'max-md:w-0 opacity-0 md:opacity-100'}`}>
           
            <XIcon className='md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer' onClick={()=>setIsOpen(!isOpen)}/>
            <Link onClick={()=>{scrollTo(0,0); setIsOpen(false)}} to='/'>Home</Link>
            <Link onClick={()=>{scrollTo(0,0); setIsOpen(false)}} to='/movies'>Movies</Link>
            <Link onClick={()=>{scrollTo(0,0); setIsOpen(false)}} to='/favorite'>Favorites</Link>
        </div>

        <div className='flex items-center gap-8'>
            <SearchIcon className='max-md:hideen w-6 h-6 cursor-pointer'/>
            {
                !user ? (
                    <button onClick={openSignIn} className='px-4 py-1 sm:px-7 sm:py-2 bg-primary
                    hover:bg-primary-dull transition rounded-full 
                    font-medium cursor-pointer'>
                        Login
                    </button>
               ) : (
                    <UserButton>
                        <UserButton.MenuItems>
                                <UserButton.Action label="My Booking" labelIcon={<TicketPlus width={15}/>} onClick={()=>navigate('/my-bookings')}/>
                        </UserButton.MenuItems>
                    </UserButton>
               )
            }
            
        </div>

        <MenuIcon className='max-md:ml-4 md:hidden w-8 h-8 cursor-pointer' onClick={()=>setIsOpen(!isOpen)} />
    </div>
  )
}

export default Navbar