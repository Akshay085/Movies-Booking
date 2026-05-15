import React, { useEffect, useState } from 'react'
import { Heart, PlayCircleIcon, StarIcon } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import BlurCircle from '../components/BlurCircle'
import timeFormat from '../lib/timeFormat'
import DateSelect from '../components/DateSelect'
import MovieCard from '../components/MovieCard'
import Loading from '../components/Loading'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { useClerk } from '@clerk/react'

const MovieDetails = () => {
  const navigate = useNavigate()
  const {id} = useParams()
  const [show, setShow] = useState(null)
  const { axios, getToken , shows , fetchFavoriteMovies, user, favoriteMovies, image_base_url} = useAppContext()
  const { openSignIn } = useClerk()

  const getShow = async () => {
    try {
      const { data } = await axios.get(`/api/show/${id}`);
      if (data.success) {
        setShow({
          movie: data.movie,
          dateTime: data.dateTime
        })
      } else {
        console.error(data.message)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleFavorite = async () => {
    try {
      const token = await getToken();
      if(!token){
        toast.error("Please log in to book tickets")
        return openSignIn()
      }

      const { data } = await axios.post('/api/user/update-favorite', {movieId: id}, 
        { headers: { Authorization: `Bearer ${token}` } })

      if(data.success){
        await fetchFavoriteMovies()
        toast.success(data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }
  
  useEffect(()=>{
    getShow()
  },[id])

  return show ? (
    <div className='px-6 md:px-16 lg:px-40 pt-24 md:pt-40 pb-10'>
      <div className='flex flex-col md:flex-row gap-8 lg:gap-16 max-w-6xl mx-auto items-center md:items-start'>
        <div className='relative shrink-0'>
          <img src={image_base_url + show.movie.poster_path} alt="" className='rounded-2xl h-[450px] md:h-[550px] w-full max-w-[300px] md:max-w-[380px] object-cover shadow-2xl border border-white/5'/>
          <div className='md:hidden absolute top-4 right-4'>
             <button onClick={handleFavorite} className='bg-black/60 backdrop-blur-md border border-white/10 p-3 rounded-full transition active:scale-95'>
               <Heart className={`w-6 h-6 ${favoriteMovies.find(movie => movie._id === id) ? 'fill-primary text-primary border-primary' : 'text-white'}`}/>
             </button>
          </div>
        </div>

        <div className='relative flex flex-col gap-4 text-center md:text-left items-center md:items-start'>
          <BlurCircle top="-100px" left="-100px" />
          <div className='flex items-center gap-3 text-primary font-medium tracking-widest text-sm uppercase'>
            <span>{show.movie.original_language?.toUpperCase() || 'ENGLISH'}</span>
            <span className='h-1 w-1 rounded-full bg-primary/40' />
            <span>{show.movie.release_date.split("-")[0]}</span>
          </div>

          <h1 className='text-4xl md:text-6xl font-serif font-bold leading-tight text-white max-w-2xl text-balance'>{show.movie.title}</h1>
          
          <div className='flex items-center gap-4 text-gray-300'>
            <div className='flex items-center gap-1 bg-white/5 px-3 py-1 rounded-full border border-white/10'>
              <StarIcon className='w-4 h-4 text-primary fill-primary'/>
              <span className='font-bold text-white'>{show.movie.vote_average.toFixed(1)}</span>
            </div>
            <span className='text-sm text-gray-400'>User Rating</span>
          </div>

          <p className='text-gray-400 text-sm md:text-base leading-relaxed max-w-xl italic'>
            "{show.movie.tagline}"
          </p>

          <p className='text-gray-300 text-sm md:text-base'>
            <span className='font-semibold text-primary'>{timeFormat(show.movie.runtime)}</span>
            <span className='mx-3 text-gray-600'>|</span>
            <span>{show.movie.genres.map(genre => genre.name).join(", ")}</span>
          </p>

          <p className='text-gray-400 text-sm leading-relaxed max-w-2xl line-clamp-4 md:line-clamp-none'>
            {show.movie.overview}
          </p>

          <div className='flex flex-col sm:flex-row items-center gap-4 mt-6 w-full sm:w-auto'>
            <button 
              onClick={() => show.movie.trailer ? window.open(`https://www.youtube.com/watch?v=${show.movie.trailer}`, '_blank') : toast.error("Trailer not available")}
              className='flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 text-sm bg-surface hover:bg-black border border-white/10 transition rounded-xl font-bold cursor-pointer active:scale-95 shadow-xl'>
              <PlayCircleIcon className='w-5 h-5 text-primary'/>
              Watch Trailer
            </button>
            <a href="#dateSelect" className='flex items-center justify-center w-full sm:w-auto px-12 py-4 text-sm bg-primary hover:bg-primary-dull transition rounded-xl font-bold cursor-pointer active:scale-95 text-black shadow-lg shadow-primary/20'>
              Buy Tickets
            </a>
            <button onClick={handleFavorite} className='hidden md:flex bg-surface border border-white/10 p-4 rounded-xl transition cursor-pointer active:scale-95 hover:bg-white/5'>
              <Heart className={`w-5 h-5 ${favoriteMovies.find(movie => movie._id === id) ? 'fill-primary text-primary' : ''}`}/>
            </button>
          </div>
        </div>
      </div>
      
      <p className='text-lg font-medium mt-20'>Your Favorite Cast</p>
      <div className='overflow-x-auto no-scrollbar mt-8 pb-4'>
        <div className='flex items-center gap-4 w-max px-4'>
          {show.movie.casts.slice(0,12).map((cast,index)=>(
            <div key={index} className='flex flex-col items-center text-center'>
              <img src={image_base_url + cast.profile_path} alt='' className='rounded-full h-20 md:h-20 aspect-square object-cover'/>
              <p className='font-medium text-xs mt-3'>{cast.name}</p>
            </div>
          ))}
        </div>
      </div>

      <DateSelect dateTime={show.dateTime} id={id}/>

      <p className='text-lg font-medium mt-20 mb-8'>You May Also Like</p>
      <div className='flex flex-wrap max-sm:justify-center gap-8'>
        {shows.slice(0,4).map((movie , index)=>(
          <MovieCard key={index} movie={movie}/>
        ))}
      </div>
      <div className='flex justify-center mt-20'>
        <button onClick={() => {navigate('/movies');  scrollTo(0,0)}} className='px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md
        font-medium cursor-pointer'>Show more</button>
      </div>
    </div>
  ) : (
    <Loading />
  )
}

export default MovieDetails