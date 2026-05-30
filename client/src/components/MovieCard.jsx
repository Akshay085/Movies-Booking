import { StarIcon } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import timeFormat from '../lib/timeFormat'

const MovieCard = ({movie}) => {

    const navigate = useNavigate()
    const image_base_url = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;
  return (
    <div className='flex flex-col justify-between p-2 sm:p-3 bg-surface border border-white/5 rounded-2xl hover:-translate-y-1 hover:border-primary/20 transition duration-300 w-full sm:w-66 shadow-xl'>
        
        <div className='relative rounded-lg overflow-hidden shrink-0'>
            <img onClick={()=> {navigate(`/movies/${movie._id}`); scrollTo(0,0)}}
            src={image_base_url + movie.poster_path} alt='' className='w-full aspect-[2/3] object-cover cursor-pointer' />
            <div className='absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1 border border-white/10'>
                <StarIcon className='w-3 h-3 text-primary fill-primary' />
                <span className='text-xs font-bold text-white'>{movie.vote_average.toFixed(1)}</span>
            </div>
        </div>

        <p className='font-sans font-bold mt-2 truncate text-lg text-white tracking-wide'>{movie.title}</p>

        <p className='text-sm text-gray-400 mt-2'>
            {new Date(movie.release_date).getFullYear()} - {movie.genres.slice(0,2).map(genre => genre.name).join(" , ")} - {timeFormat(movie.runtime)}
        </p>

        <div className='mt-4 pb-1'>
            <button onClick={()=> {navigate(`/movies/${movie._id}`); scrollTo(0,0)}}
            className='w-full py-2.5 text-xs bg-primary hover:bg-primary-dull text-black transition rounded-xl font-bold cursor-pointer active:scale-95 text-center'>
                Buy Tickets
            </button>
        </div>
    </div>
  )
}

export default MovieCard