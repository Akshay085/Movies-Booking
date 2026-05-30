import React, { useEffect, useState } from 'react'
import Loading from '../components/Loading';
import Title from '../components/Title';
import { ChartLineIcon, IndianRupeeIcon, PlayCircleIcon, StarIcon, UserIcon } from 'lucide-react';
import BlurCircle from '../components/BlurCircle';
import dateFormat from '../lib/dateFormat';
import { useAppContext } from '../context/AppContext';


const Dashbord = () => {

  const { axios , image_base_url, currency } = useAppContext();

  const [dashboardData , setDashboardData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeShows: [],
    totalUser: 0
  });
  const [loading , setLoading] = useState(true);

  const dashboardCards = [
    { title: "Total Bookings" , value: dashboardData.totalBookings || 0, icon: ChartLineIcon },
    { title: "Total Revenue" , value: currency + " " + (dashboardData.totalRevenue || 0) , icon: IndianRupeeIcon }, 
    { title: "Active Show" , value: dashboardData.activeShows.length || "0" , icon: PlayCircleIcon },
    { title: "Total Users" , value: dashboardData.totalUser || "0" , icon: UserIcon }
  ]

  const fetchDashboardData = async () => {
    try {
      const { data } = await axios.get('/api/admin/dashboard');
      if (data.success) {
        setDashboardData(data.dashboardData);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    fetchDashboardData();
  },[]);

  return !loading ? (
    <div className='pb-10 max-w-7xl'>
      <Title text1="Admin" text2="Dashboard"/> 
      
      {/* Stats Grid */}
      <div className='relative mt-8'>
        <BlurCircle top="-100px" left='0' />
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6'>
          {dashboardCards.map((card, index)=>(
            <div key={index} className='flex items-center justify-between p-6 bg-primary/5 border 
            border-primary/10 rounded-2xl hover:border-primary/30 transition-all shadow-sm'>
              <div>
                <p className='text-xs font-semibold text-gray-400 uppercase tracking-wider'>{card.title}</p>
                <p className='text-2xl font-bold mt-2 text-white'>{card.value}</p>
              </div>
              <div className='bg-primary/20 p-3 rounded-xl'>
                <card.icon className='w-6 h-6 text-primary' />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='mt-12 flex justify-between items-center'>
        <p className='text-xl font-bold text-white'>Active Shows</p>
        <span className='text-xs text-gray-500'>{dashboardData.activeShows.length} Shows Live</span>
      </div>

      {/* Active Shows Grid */}
      <div className='relative grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 mt-6'>
        <BlurCircle top='100px' left='-10%'/>
        {dashboardData.activeShows.map((show)=>(
          <div key={show._id} className='group flex flex-col bg-surface border border-white/5 rounded-2xl overflow-hidden hover:-translate-y-1 transition duration-300 shadow-xl'>
            <div className='relative aspect-[2/3] overflow-hidden'>
              <img src={image_base_url + show.movie.poster_path} alt="" className='w-full h-full object-cover group-hover:scale-105 transition duration-500'/>
              <div className='absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1 border border-white/10'>
                <StarIcon className='w-3 h-3 text-primary fill-primary' />
                <span className='text-xs font-bold'>{show.movie.vote_average.toFixed(1)}</span>
              </div>
            </div>
            
            <div className='p-4 flex-1 flex flex-col'>
              <p className='font-bold text-white truncate mb-1'>{show.movie.title}</p>
              <p className='text-xs text-gray-400 mb-4'>{dateFormat(show.showDateTime)}</p>
              
              <div className='mt-auto flex items-center justify-between border-t border-white/5 pt-3'>
                <p className='text-lg font-bold text-primary'>{currency}{show.showPrice}</p>
                <div className='text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-bold uppercase'>
                  Live
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {dashboardData.activeShows.length === 0 && (
        <div className='text-center py-20 text-gray-500 italic'>
          No active shows currently running.
        </div>
      )}
    </div>
  ) : <Loading />
}

export default Dashbord
