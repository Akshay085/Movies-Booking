import React, { useEffect, useState } from 'react'
import Loading from '../components/Loading';
import Title from '../components/Title';
import dateFormat from '../lib/dateFormat';
import { useAppContext } from '../context/AppContext';

const ListShows = () => {
  
  const { axios, currency } = useAppContext();
  const [shows , setShows] = useState([]);
  const [loading , setLoading] = useState(true);

  const getAllShows = async() => {
    try {
      const { data } = await axios.get('/api/admin/all-shows');
      if (data.success) {
        setShows(data.shows);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{
    getAllShows();
  },[]);

  return !loading ? (
    <div className='pb-10'>
      <Title text1="List" text2="Shows" />
      
      {/* Desktop Table View */}
      <div className='hidden md:block mt-6 overflow-x-auto border border-primary/10 rounded-lg'>
        <table className='w-full border-collapse text-nowrap'>
          <thead>
            <tr className='bg-primary/10 text-left text-white border-b border-primary/10'>
              <th className='p-4 font-medium pl-6'>Movie Name</th>
              <th className='p-4 font-medium'>Show Time</th>
              <th className='p-4 font-medium text-center'>Total Bookings</th>
              <th className='p-4 font-medium text-right pr-6'>Total Earnings</th>
            </tr>
          </thead>
          <tbody className='text-sm'>
            {shows.map((show , index)=>(
              <tr key={index} className='border-b border-primary/5 bg-primary/5 hover:bg-primary/10 transition-colors'>
                <td className='p-4 pl-6 font-medium'>{show.movie.title}</td>
                <td className='p-4'>{dateFormat(show.showDateTime)}</td>
                <td className='p-4 text-center'>{Object.keys(show.occupiedSeats).length}</td>
                <td className='p-4 text-right pr-6 font-bold text-primary'>
                  {currency}{Object.keys(show.occupiedSeats).length * show.showPrice}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className='md:hidden mt-6 space-y-4'>
        {shows.map((show, index) => (
          <div key={index} className='bg-primary/5 border border-primary/10 rounded-xl p-5 shadow-sm'>
            <div className='mb-4'>
              <p className='text-xs text-gray-400 uppercase tracking-wider'>Movie</p>
              <p className='font-bold text-lg leading-tight'>{show.movie.title}</p>
            </div>
            
            <div className='grid grid-cols-2 gap-4 mb-4 border-y border-primary/10 py-4'>
              <div>
                <p className='text-xs text-gray-400'>Bookings</p>
                <p className='text-sm font-medium'>{Object.keys(show.occupiedSeats).length} Tickets</p>
              </div>
              <div>
                <p className='text-xs text-gray-400'>Earnings</p>
                <p className='text-sm font-bold text-primary'>{currency}{Object.keys(show.occupiedSeats).length * show.showPrice}</p>
              </div>
            </div>

            <div className='flex justify-between items-center text-xs text-gray-300'>
               <p className='font-medium'>{dateFormat(show.showDateTime)}</p>
               <p className='text-gray-500'>Price: {currency}{show.showPrice}</p>
            </div>
          </div>
        ))}
      </div>

      {shows.length === 0 && (
        <div className='text-center py-20 text-gray-500'>
          No shows found.
        </div>
      )}
    </div>
  ) : <Loading />
}

export default ListShows
