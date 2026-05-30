import React from 'react'
import { assets } from '../assets/assets'
import {  LayoutDashboardIcon, ListCollapseIcon, ListIcon, PlusSquareIcon } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const AdminSidebar = () => {
    
    const user ={
        firstName: 'Admin',
        lastName: 'User',
        imageUrl: assets.profile,
    }

    const adminNavLinks = [
        { name: 'Dashbord', path: '/' , icon: LayoutDashboardIcon },
        { name: 'Add Shows', path: '/add-shows' , icon: PlusSquareIcon },
        { name: 'List Shows', path: '/list-shows' , icon: ListIcon},
        { name: 'List Bookings', path: '/list-bookings' , icon: ListCollapseIcon}, 
    ]

  return (
    <>
      {/* Desktop Sidebar (Visible on md and up) */}
      <div className='hidden md:flex flex-col items-center pt-8 max-w-60 w-full h-[calc(100vh-64px)] border-r border-gray-300/20 text-sm sticky top-16'>
          <img className='h-14 w-14 rounded-full mx-auto border-2 border-primary/20' src={user.imageUrl} alt="profile" />
          <p className='mt-2 text-base font-medium'>{user.firstName} {user.lastName}</p>
          
          <div className='w-full mt-6'>
              {adminNavLinks.map((link, index) => (
                  <NavLink 
                      key={index} 
                      to={link.path} 
                      end 
                      className={({ isActive }) => `relative flex items-center gap-3 w-full py-3.5 pl-10 text-gray-400 transition-all hover:text-white ${isActive ? 'bg-primary/10 text-primary border-r-4 border-primary' : ''}`}
                  >
                      <link.icon className='w-5 h-5'/>
                      <p>{link.name}</p>
                  </NavLink>
              ))}
          </div>
      </div>

      {/* Mobile Bottom Navigation (Visible on small screens) */}
      <div className='md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-lg border-t border-white/10 flex items-center justify-around z-50 px-2 shadow-2xl'>
          {adminNavLinks.map((link, index) => (
              <NavLink 
                  key={index} 
                  to={link.path} 
                  end 
                  className={({ isActive }) => `flex flex-col items-center justify-center gap-1 w-full h-full text-[10px] transition-all ${isActive ? 'text-primary' : 'text-gray-500'}`}
              >
                  <link.icon className={`w-5 h-5`} />
                  <span className='font-medium'>{link.name}</span>
              </NavLink>
          ))}
      </div>
    </>
  )
}

export default AdminSidebar
