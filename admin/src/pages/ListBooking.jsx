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
    <>
      <Title text1="List" text2="Bookings" />
      <div className='max-w-4xl mt-6 overflow-x-auto'>
        <table className='w-full border-collapse rounded-md overflow-hidden text-nowrap'>
          <thead>
            <tr className='bg-primary/20 text-left text-white'>
              <th className='p-2 font-medium pl-5'>User Name</th>
              <th className='p-2 font-medium'>Movie Name</th>
              <th className='p-2 font-medium'>Show Time</th>
              <th className='p-2 font-medium'>Seats</th>
              <th className='p-2 font-medium'>Amount</th>
              <th className='p-2 font-medium'>Status</th>
            </tr>
          </thead>
          <tbody className='text-sm font-light'>
            {bookings.map((item , index) => (
              <tr key={index} className='border-b border-primary/10 bg-primary/5 even:bg-primary/10'>
                <td className='p-2 min-w-45 pl-5'>{item.user.name}</td>
                <td className='p-2'>{item.show.movie.title}</td>
                <td className='p-2'>{dateFormat(item.show.showDateTime)}</td>
                <td className='p-2'>{Object.keys(item.bookedSeats).map(seat => item.bookedSeats[seat]).join(", ")}</td>
                <td className='p-2'>{currency} {item.amount}</td>
                <td className='p-2'>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${item.isPaid ? 'bg-green-500/20 text-green-500' : 'bg-orange-500/20 text-orange-500'}`}>
                    {item.isPaid ? "Paid" : "Unpaid"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> 
    </>
  ) : <Loading />
}

export default ListBooking
