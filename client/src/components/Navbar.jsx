import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { MenuIcon, SearchIcon, TicketIcon, TicketPlus, XIcon } from 'lucide-react'
import { useClerk, useUser , UserButton } from '@clerk/react'
import { useAppContext } from '../context/AppContext'

const Navbar = () => {
    const [isOpen , setIsOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const {user} = useUser()
    const {openSignIn} = useClerk()

    const navigate = useNavigate()
    const {favoriteMovies} = useAppContext()

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true)
            } else {
                setIsScrolled(false)
            }
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [isOpen])

  return (
    <div className={`fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5 transition-all duration-300 ${isScrolled ? 'bg-background/85 backdrop-blur-md border-b border-white/5 py-4 shadow-lg' : 'bg-transparent'}`}>
        <Link to='/' className='z-[60]'>
            <div className='flex items-center text-xl md:text-2xl tracking-[0.2em] font-logo'>
                <span className='text-primary'>AVR</span>
                <span className='text-white'>Theater</span>
            </div>
        </Link>
        
        <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center gap-10 bg-black/95 backdrop-blur-xl transition-all duration-500 md:static md:inset-auto md:flex-row md:bg-white/5 md:border md:border-white/10 md:rounded-full md:px-10 md:py-3 md:h-auto md:w-auto md:opacity-100 md:translate-x-0 ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full md:translate-x-0 opacity-0'}`}>
            <XIcon className='md:hidden absolute top-6 right-6 w-8 h-8 cursor-pointer text-primary' onClick={()=>setIsOpen(false)}/>
            <Link onClick={()=>{scrollTo(0,0); setIsOpen(false)}} to='/' className='text-2xl md:text-sm font-medium hover:text-primary transition'>Home</Link>
            <Link onClick={()=>{scrollTo(0,0); setIsOpen(false)}} to='/movies' className='text-2xl md:text-sm font-medium hover:text-primary transition'>Movies</Link>
            {favoriteMovies.length > 0 && <Link onClick={()=>{scrollTo(0,0); setIsOpen(false)}} to='/favorite' className='text-2xl md:text-sm font-medium hover:text-primary transition'>Favorites</Link>}
        </div>

        <div className='flex items-center gap-4 md:gap-8'>
            
            {
                !user ? (
                    <button onClick={openSignIn} className='px-5 py-1.5 sm:px-7 sm:py-2 bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer text-sm md:text-base text-black'>
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
            <MenuIcon className='md:hidden w-7 h-7 cursor-pointer text-white' onClick={()=>setIsOpen(true)} />
        </div>
    </div>
  )
}

export default Navbar