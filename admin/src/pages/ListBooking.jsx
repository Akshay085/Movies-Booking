import React, { useEffect, useState } from 'react'
import Loading from '../components/Loading';
import Title from '../components/Title';
import dateFormat from '../lib/dateFormat';
import { useAppContext } from '../context/AppContext';

const ListBooking = () => {

  const { axios, currency } = useAppContext();

  const [bookings , setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getAllBookings = async () => {
    try {
      const { data } = await axios.get('/api/admin/all-bookings');
      if (data.success) {
        setBookings(data.bookings);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(()=>{
    getAllBookings();
  },[]);

  return ! isLoading ? (
    <div className='pb-10'>
      <Title text1="List" text2="Bookings" />
      
      {/* Desktop Table View */}
      <div className='hidden md:block mt-6 overflow-x-auto border border-primary/10 rounded-lg'>
        <table className='w-full border-collapse text-nowrap'>
          <thead>
            <tr className='bg-primary/10 text-left text-white border-b border-primary/10'>
              <th className='p-4 font-medium pl-6'>User Name</th>
              <th className='p-4 font-medium'>Movie Name</th>
              <th className='p-4 font-medium'>Show Time</th>
              <th className='p-4 font-medium'>Seats</th>
              <th className='p-4 font-medium'>Amount</th>
              <th className='p-4 font-medium text-center'>Status</th>
            </tr>
          </thead>
          <tbody className='text-sm'>
            {bookings.map((item , index) => (
              <tr key={index} className='border-b border-primary/5 bg-primary/5 hover:bg-primary/10 transition-colors'>
                <td className='p-4 pl-6 font-medium'>{item.user.name}</td>
                <td className='p-4'>{item.show.movie.title}</td>
                <td className='p-4'>{dateFormat(item.show.showDateTime)}</td>
                <td className='p-4'>{item.bookedSeats.join(", ")}</td>
                <td className='p-4'>{currency}{item.amount}</td>
                <td className='p-4 text-center'>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${item.isPaid ? 'bg-green-500/20 text-green-500' : 'bg-orange-500/20 text-orange-500'}`}>
                    {item.isPaid ? "Paid" : "Unpaid"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className='md:hidden mt-6 space-y-4'>
        {bookings.map((item, index) => (
          <div key={index} className='bg-primary/5 border border-primary/10 rounded-xl p-5 shadow-sm'>
            <div className='flex justify-between items-start mb-4'>
              <div>
                <p className='text-xs text-gray-400 uppercase tracking-wider'>Customer</p>
                <p className='font-bold text-lg'>{item.user.name}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.isPaid ? 'bg-green-500/20 text-green-500' : 'bg-orange-500/20 text-orange-500'}`}>
                {item.isPaid ? "Paid" : "Unpaid"}
              </span>
            </div>
            
            <div className='grid grid-cols-2 gap-4 mb-4'>
              <div>
                <p className='text-xs text-gray-400'>Movie</p>
                <p className='text-sm font-medium truncate'>{item.show.movie.title}</p>
              </div>
              <div>
                <p className='text-xs text-gray-400'>Amount</p>
                <p className='text-sm font-bold text-primary'>{currency}{item.amount}</p>
              </div>
            </div>

            <div className='border-t border-primary/10 pt-4 flex justify-between items-center text-xs text-gray-300'>
              <span>{dateFormat(item.show.showDateTime)}</span>
              <span>Seats: {item.bookedSeats.join(", ")}</span>
            </div>
          </div>
        ))}
      </div>

      {bookings.length === 0 && (
        <div className='text-center py-20 text-gray-500'>
          No bookings found.
        </div>
      )}
    </div>
  ) : <Loading />
}

export default ListBooking
