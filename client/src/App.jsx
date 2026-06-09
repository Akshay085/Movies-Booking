import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Movies from './pages/Movies'
import MovieDetails from './pages/MovieDetails'
import SeatLayout from './pages/SeatLayout'
import MyBookings from './pages/MyBookings'
import Favorite from './pages/Favorite'
import Payment from './pages/Payment'
import {Toaster} from 'react-hot-toast'
import Footer from './components/Footer'
import Loading from './components/Loading'
import About from './pages/About'
import Contact from './pages/Contact'
import Privacy from './pages/Privacy'

const App = () => {
  return (
    <>
      <Toaster />
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/movies' element={<Movies />} />
        <Route path='/movies/:id' element={<MovieDetails />} />
        <Route path='/movies/:id/:date' element={<SeatLayout />} />
        <Route path='/my-bookings' element={<MyBookings />} />
        <Route path='/loading/:nextUrl' element={<Loading />} />
        <Route path='/payment/:bookingId' element={<Payment />} />
        <Route path='/favorite' element={<Favorite />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/privacy' element={<Privacy />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App