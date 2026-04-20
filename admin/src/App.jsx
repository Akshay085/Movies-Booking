import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './pages/Layout'
import Dashbord from './pages/Dashbord'
import AddShows from './pages/AddShows'
import ListShows from './pages/ListShows'
import ListBooking from './pages/ListBooking'

const App = () => {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Dashbord />}/>
          <Route path='add-shows' element={<AddShows />}/>
          <Route path='list-shows' element={<ListShows />}/>
          <Route path='list-bookings' element={<ListBooking />}/>
        </Route>
      </Routes>
    </>
  )
}

export default App