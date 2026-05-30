import React from 'react'
import AdminNavbar from '../components/AdminNavbar'
import AdminSidebar from '../components/AdminSidebar'
import { Outlet } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import Login from './Login'

const Layout = () => {
  const { isAdminAuthenticated } = useAppContext()

  if (!isAdminAuthenticated) {
    return (
      <>
        <AdminNavbar />
        <Login />
      </>
    )
  }

  return (
    <>
        <AdminNavbar />
        <div className='flex'>
            <AdminSidebar />
            <div className='flex-1 px-4 py-10 pb-24 md:pb-10 md:px-10 h-[calc(100vh-64px)] overflow-y-auto'>
                    <Outlet />                
            </div>
        </div> 
    </>
  )
}

export default Layout
