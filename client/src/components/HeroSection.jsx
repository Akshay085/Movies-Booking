import { assets } from '../assets/assets'
import { ArrowRight, CalendarIcon, ClockIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const HeroSection = () => {

    const navigate = useNavigate()

  return (
    <div className='flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36 bg-[url("/backgroundImage.png")] bg-cover bg-center h-[90vh] md:h-screen relative'>
        <div className='absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent md:hidden' />
        
        <div className='relative z-10 flex flex-col items-start gap-4'>
            <img src={assets.marvelLogo} alt="" className='max-h-8 md:h-11 mt-10 md:mt-20' />

            <h1 className='text-4xl sm:text-5xl md:text-[70px] leading-tight md:leading-18 font-serif font-semibold max-w-full md:max-w-2xl text-balance'>Guardians <br className='hidden md:block' /> of the Galaxy</h1>
            
            <div className='flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm text-gray-300'>
                <span className='bg-white/10 px-2 py-0.5 rounded'>Action | Adventure | Sci-Fi</span>
                <div className='flex items-center gap-1'>
                    <CalendarIcon className='w-4 h-4' />2018
                </div>
                <div className='flex items-center gap-1'>
                    <ClockIcon className='w-4 h-4' />2h 8m
                </div>
            </div>
            
            <p className='max-w-md text-gray-400 text-sm md:text-base leading-relaxed'>In a post-apocalyptic world where cities ride on wheels and consume each other to survive, 
                two people meet in London and try to stop a conspiracy.</p>
            
            <button onClick={()=> navigate('/movies')} className='flex items-center gap-2 px-8 py-3.5 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-bold text-black cursor-pointer shadow-lg shadow-primary/20 mt-2'>
                Explore Movies
                <ArrowRight className='w-5 h-5' />
            </button>
        </div>
    </div>
  )
}

export default HeroSection