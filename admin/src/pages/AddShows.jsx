import React, { useEffect, useState } from 'react'
import Loading from '../components/Loading';
import Title from '../components/Title';
import { CheckIcon, DeleteIcon, StarIcon } from 'lucide-react';
import kConverter from '../lib/kConverter';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const AddShows = () => {

  const { axios , image_base_url, currency } = useAppContext();
  const [nowPlayingMovies , setNowPlayingMovies] = useState([]);
  const [selectedMovie , setSelectedMovie] = useState(null);
  const [dateTimeSelection , setDateTimeSelection] = useState({});
  const [dateTimeInput , setDateTimeInput] = useState("");
  const [showPrice , setShowPrice] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchNowPlayingMovies = async () => {
    try {
      const { data } = await axios.get('/api/show/now-playing');
      if (data.success) {
        setNowPlayingMovies(data.movies);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDateTimeAdd = async () => {
    if(!dateTimeInput) return;
    const [date , time] = dateTimeInput.split("T");
    if(!date || !time) return;

    setDateTimeSelection((prev)=>{
      const times = prev[date] || [];
      if(!times.includes(time)){
        return {...prev, [date]: [...times, time]};
      }
      return prev;
    });
  };

  const handleRemoveTime = async (date , time) => {
    setDateTimeSelection((prev)=>{
      const filteredTimes = prev[date].filter((t)=> t !== time);
      if (filteredTimes.length === 0){
        const { [date]: _, ...rest } = prev;
        return rest;
      }
      return {
        ...prev,
        [date]: filteredTimes,
      };
    });
  };

  const handleAddShow = async () => {
    if (!selectedMovie) return toast.error("Please select a movie");
    if (!showPrice) return toast.error("Please enter show price");
    if (Object.keys(dateTimeSelection).length === 0) return toast.error("Please select at least one date and time");

    const showsInput = Object.entries(dateTimeSelection).map(([date, time]) => ({
      date,
      time
    }));

    try {
      const { data } = await axios.post('/api/show/add', {
        movieId: selectedMovie,
        showsInput,
        showPrice: Number(showPrice)
      });

      if (data.success) {
        toast.success(data.message);
        setSelectedMovie(null);
        setDateTimeSelection({});
        setShowPrice("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  useEffect(()=>{
    fetchNowPlayingMovies();
  },[]);

  return nowPlayingMovies.length > 0 ? (
    <div className='pb-10 max-w-5xl'>
      <Title text1="Add" text2="Shows" />
      
      {/* Kept Original: Horizontal Movie Selection */}
      <p className='my-10 text-lg font-medium'>Now Playing Movies</p>
      <div className='overflow-x-auto pb-4 no-scrollbar'>
        <div className='group flex flex-wrap gap-4 mt-4 w-max'>
          {nowPlayingMovies.map((movie)=>(
            <div key={movie.id} className={`relative max-w-40 cursor-pointer group-hover:not-hover:opacity-40 hover:-translate-y-1 
              transition duration-300`} onClick={()=> setSelectedMovie(movie.id)}>
              <div className='relative rounded-lg overflow-hidden'>
                <img src={image_base_url + movie.poster_path} alt="" className='w-full object-cover brightness-90'/>
                <div className='text-sm flex items-center justify-between p-2 bg-black/70 w-full absolute bottom-0 left-0'> 
                  <p className='flex items-center gap-1 text-gray-400'>
                    <StarIcon className='w-4 h-4 text-primary fill-primary' />
                    {movie.vote_average.toFixed(1)}
                  </p>
                  <p className='text-gray-300'>{kConverter(movie.vote_count)} Votes</p>
                </div>
              </div>
              {selectedMovie === movie.id && (
                <div className='absolute top-2 right-2 flex items-center justify-center bg-primary h-6 w-6 rounded shadow-lg'>
                  <CheckIcon className='w-4 h-4 text-white' strokeWidth={2.5}/>
                </div>
              )}
              <p className='font-medium truncate mt-2'>{movie.title}</p>
              <p className='text-gray-400 text-sm'>{movie.release_date}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Responsive Sections: Price and Date/Time */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mt-12'>
        <div className='space-y-6'>
          {/* Show Price Input */}
          <div>
              <label className='block text-sm font-medium mb-2 text-gray-300'>Show Price</label>
              <div className='flex items-center gap-2 border border-primary/20 bg-primary/5 px-4 py-3 rounded-xl focus-within:border-primary/50 transition-all'>
                <span className='text-primary font-bold'>{currency}</span>
                <input min={0} type="number" value={showPrice} onChange={(e)=> setShowPrice(e.target.value)} 
                placeholder="0.00" className='bg-transparent outline-none flex-1 text-white'/>
              </div>
          </div>

          {/* Date and Time Selection*/}
          <div>
              <label className='block text-sm font-medium mb-2 text-gray-300'>Select Date and Time</label>
              <div className='flex flex-col sm:flex-row gap-3'>
                <div className='flex-1 border border-primary/20 bg-primary/5 px-4 py-3 rounded-xl focus-within:border-primary/50 transition-all'>
                  <input type="datetime-local" value={dateTimeInput} onChange={(e)=> setDateTimeInput(e.target.value)} 
                  className='bg-transparent outline-none w-full text-white invert-[0.8] brightness-200'/>
                </div>
                <button onClick={handleDateTimeAdd} className='bg-primary text-black font-bold px-6 py-3 rounded-xl hover:bg-primary-dull transition-all cursor-pointer active:scale-95'>
                  Add Time
                </button>
              </div>
          </div>
        </div>

        {/* Selected Schedule List */}
        <div className='bg-primary/5 border border-primary/10 rounded-2xl p-6'>
          <h2 className='text-sm font-semibold mb-4 text-primary uppercase tracking-wider'>Selected Schedule</h2>
          {Object.keys(dateTimeSelection).length > 0 ? (
            <ul className='space-y-4'>
              {Object.entries(dateTimeSelection).map(([date,times])=>(
                <li key={date} className='border-b border-primary/10 pb-3 last:border-0'>
                  <div className='text-xs font-bold text-gray-400 mb-2 uppercase'>{new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                  <div className='flex flex-wrap gap-2'>
                    {times.map((time)=>(
                      <div key={time} className='bg-primary/10 border border-primary/30 px-3 py-1.5 flex items-center rounded-lg'>
                        <span className='text-sm'>{time}</span>
                        <DeleteIcon onClick={()=>handleRemoveTime(date , time)} width={14} className='ml-2 text-red-400 hover:text-red-500 cursor-pointer' />
                      </div>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className='text-gray-500 text-sm italic text-center py-10'>No schedule added yet.</p>
          )}
        </div>
      </div>

      <div className='mt-10 pt-6 border-t border-primary/10'>
        <button onClick={handleAddShow} className='w-full md:w-auto bg-primary text-black font-bold px-12 py-4 rounded-xl hover:bg-primary-dull transition-all cursor-pointer active:scale-95 shadow-lg shadow-primary/20'>
          Create Shows
        </button>
      </div>
    </div>
  ) : <Loading />
}

export default AddShows
