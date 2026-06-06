import React, { useEffect, useState } from 'react'
import Loading from '../components/Loading'
import BlurCircle from '../components/BlurCircle'
import timeFormat from '../lib/timeFormat'
import dateFormat from '../lib/dateFormat'
import { useAppContext } from '../context/AppContext'
import { Link, useNavigate } from 'react-router-dom'

const MyBookings = () => {
  const { axios, getToken, image_base_url, currency } = useAppContext()
  const navigate = useNavigate()

  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const getBookings = async () => {
    try {
      const token = await getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        await axios.post('/api/booking/verify', {}, { headers: { Authorization: `Bearer ${token}` } })
      } catch (e) {
        console.error("Verification failed", e);
      }

      const { data } = await axios.get('/api/user/bookings', { headers: { Authorization: `Bearer ${token}` } })
      if (data.success) {
        setBookings(data.bookings)
      } else {
        console.error(data.message)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getBookings()
  },[])

  return !isLoading ? (
    <div className='relative px-4 sm:px-6 md:px-16 lg:px-40 pt-24 md:pt-40 pb-20 min-h-[80vh] overflow-hidden'>
      <BlurCircle top='100px' left='100px'/>
      <div>
        <BlurCircle bottom='0px' left='600px'/>
      </div>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl font-serif font-semibold mb-8 text-primary'>My Bookings</h1>

        {bookings.length === 0 ? (
          <div className='text-center mt-20'>
            <h2 className='text-2xl text-gray-400'>No Bookings Found</h2>
          </div>
        ) : (
          bookings.map((item, index)=>(
            <div key={index} className='flex flex-col md:flex-row justify-between bg-surface border
            border-white/5 rounded-2xl mt-6 p-4 w-full shadow-xl transition-all duration-300 hover:border-primary/20 hover:bg-surface/80'>
              <div className='flex gap-4 items-start'>
                <img 
                  onClick={()=> {navigate(`/movies/${item.show.movie._id}`); scrollTo(0,0)}}
                  src={image_base_url + item.show.movie.poster_path} 
                  alt="" 
                  className='w-24 sm:w-28 md:w-32 aspect-[2/3] object-cover rounded-xl cursor-pointer hover:opacity-80 transition shadow-lg shrink-0'
                />
                <div className='flex flex-col py-1 md:py-2 min-w-0'>
                  <p 
                    onClick={()=> {navigate(`/movies/${item.show.movie._id}`); scrollTo(0,0)}}
                    className='text-lg sm:text-xl font-bold cursor-pointer hover:text-primary transition text-white leading-tight'
                  >
                    {item.show.movie.title}
                  </p>
                  <p className='text-gray-400 text-xs sm:text-sm font-medium mt-1'>{timeFormat(item.show.movie.runtime)}</p>
                  
                  <div className='mt-3 sm:mt-4 md:mt-auto space-y-1'>
                     <p className='text-primary font-semibold text-xs sm:text-sm'>{dateFormat(item.show.showDateTime)}</p>
                     <p className='text-gray-500 text-[10px] sm:text-xs'>Booking ID: <span className='text-gray-300'>{item._id.slice(-8).toUpperCase()}</span></p>
                  </div>
                </div>
              </div>

              <div className='flex flex-row md:flex-col justify-between items-center md:items-end mt-4 md:mt-0 pt-4 md:pt-2 border-t md:border-t-0 border-white/5 gap-4'>
                <div className='flex flex-col gap-1'>
                  <p className='text-xl sm:text-2xl font-black text-white leading-none'>{currency}{item.amount}</p>
                  <div className='flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-gray-400 mt-1.5'>
                    <span>Tickets: <strong className='text-white font-medium'>{item.bookedSeats.length}</strong></span>
                    <span className='text-gray-600'>•</span>
                    <span className='truncate max-w-[120px] sm:max-w-none'>Seats: <strong className='text-primary font-semibold'>{item.bookedSeats.join(", ")}</strong></span>
                  </div>
                </div>
                
                <div className='shrink-0'>
                  {!item.isPaid && (
                    <Link to={item.paymentLink} className='inline-flex items-center bg-primary px-5 py-2 text-xs sm:text-sm rounded-xl font-bold text-black cursor-pointer hover:bg-primary-dull transition-all duration-200 active:scale-95 shadow-lg shadow-primary/20'>
                      Pay Now
                    </Link>
                  )}
                  {item.isPaid && (
                    <span className='inline-flex items-center bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-1.5 text-[10px] sm:text-xs rounded-full font-bold uppercase tracking-wider'>
                      Confirmed
                    </span>
                  )}
                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  ) : (
    <Loading />
  )
}

export default MyBookings