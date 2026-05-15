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
    <div className='relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh]'>
      <BlurCircle top='100px' left='100px'/>
      <div>
        <BlurCircle bottom='0px' left='600px'/>
      </div>
      <h1 className='text-3xl font-serif font-semibold mb-8 text-primary'>My Bookings</h1>

      {bookings.length === 0 ? (
        <div className='text-center mt-20'>
          <h2 className='text-2xl text-gray-400'>No Bookings Found</h2>
        </div>
      ) : (
        bookings.map((item, index)=>(
          <div key={index} className='flex flex-col md:flex-row justify-between bg-surface border
          border-white/5 rounded-2xl mt-6 p-4 max-w-4xl shadow-xl transition hover:border-primary/20'>
            <div className='flex flex-col sm:flex-row gap-4'>
              <img 
                onClick={()=> {navigate(`/movies/${item.show.movie._id}`); scrollTo(0,0)}}
                src={image_base_url + item.show.movie.poster_path} 
                alt="" 
                className='w-full sm:w-32 aspect-[2/3] object-cover rounded-xl cursor-pointer hover:opacity-80 transition shadow-lg'
              />
              <div className='flex flex-col py-2'>
                <p 
                  onClick={()=> {navigate(`/movies/${item.show.movie._id}`); scrollTo(0,0)}}
                  className='text-xl font-bold cursor-pointer hover:text-primary transition text-white'
                >
                  {item.show.movie.title}
                </p>
                <p className='text-gray-400 text-sm font-medium'>{timeFormat(item.show.movie.runtime)}</p>
                
                <div className='mt-4 md:mt-auto space-y-1'>
                   <p className='text-primary font-semibold text-sm'>{dateFormat(item.show.showDateTime)}</p>
                   <p className='text-gray-500 text-xs'>Booking ID: <span className='text-gray-300'>{item._id.slice(-8).toUpperCase()}</span></p>
                </div>
              </div>
            </div>

            <div className='flex flex-col md:items-end justify-between p-2 mt-4 md:mt-0 border-t md:border-t-0 border-white/5 pt-4 md:pt-0'>
              <div className='flex items-center justify-between md:justify-end gap-4 w-full'>
                <p className='text-2xl font-bold text-white'>{currency}{item.amount}</p>
                {!item.isPaid && (
                  <Link to={item.paymentLink} className='bg-primary px-6 py-2 text-sm rounded-full font-bold text-black cursor-pointer hover:bg-primary-dull transition shadow-lg shadow-primary/20'>
                    Pay Now
                  </Link>
                )}
                {item.isPaid && (
                  <span className='bg-green-500/20 text-green-500 px-4 py-1 text-xs rounded-full font-bold uppercase tracking-wider'>
                    Confirmed
                  </span>
                )}
              </div>
              <div className='text-sm mt-4 md:text-right space-y-1'>
                  <p className='text-gray-400'>Tickets: <span className='text-white font-medium'>{item.bookedSeats.length}</span></p>
                  <p className='text-gray-400'>Seats: <span className='text-primary font-bold'>{item.bookedSeats.join(", ")}</span></p>
              </div>
            </div>

          </div>
        ))
      )}

    </div>
  ) : (
    <Loading />
  )
}

export default MyBookings