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
          border-white/5 rounded-lg mt-6 p-3 max-w-3xl shadow-lg'>
            <div className='flex flex-col md:flex-row'>
              <img 
                onClick={()=> {navigate(`/movies/${item.show.movie._id}`); scrollTo(0,0)}}
                src={image_base_url + item.show.movie.poster_path} 
                alt="" 
                className='md:max-w-45 aspect-video h-auto object-cover object-bottom rounded cursor-pointer hover:opacity-80 transition'
              />
              <div className='flex flex-col p-4'>
                <p 
                  onClick={()=> {navigate(`/movies/${item.show.movie._id}`); scrollTo(0,0)}}
                  className='text-lg font-semibold cursor-pointer hover:text-primary transition'
                >
                  {item.show.movie.title}
                </p>
                <p className='text-gray-400 text-sm'>{timeFormat(item.show.movie.runtime)}</p>
                <p className='text-gray-400 text-sm mt-auto'>{dateFormat(item.show.showDateTime)}</p>
              </div>
            </div>

            <div className='flex flex-col md:items-end md:text-right justify-between p-4'>
              <div className='flex items-center gap-4'>
                <p className='text-2xl font-semibold mb-3'>{currency}{item.amount}</p>
                {!item.isPaid && <Link to={item.paymentLink} className='bg-primary px-4 py-1.5 mb-3 text-sm rounded-full font-medium cursor-pointer'>
                  Pay Now</Link>}
              </div>
              <div className='text-sm'>
                  <p><span className='text-gray-400'>Total Tickets:</span> {item.bookedSeats.length}</p>
                  <p><span className='text-gray-400'>Seat Number:</span> {item.bookedSeats.join(", ")}</p>
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