import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { assets } from "../assets/assets"
import Loading from "../components/Loading"
import { ArrowRightIcon, ClockIcon } from "lucide-react"
import isoTimeFormat from "../lib/isoTimeFormat"
import BlurCircle from "../components/BlurCircle"
import { toast } from "react-hot-toast"
import { useAppContext } from "../context/AppContext"
import { useClerk } from "@clerk/react"

const SeatLayout = () => {

  const groupRows = [["A", "B"], ["C", "D"], ["E", "F"], ["G", "H"], ["I", "J"]]

  const {id,date} = useParams()
  const [selectedSeats, setSelectedSeats] = useState([])
  const [selectedTime, setSelectedTime] = useState(null)
  const [show, setShow] = useState(null)
  const [occupiedSeats, setOccupiedSeats] = useState([])
  
  const { axios, getToken , image_base_url } = useAppContext()
  const navigate = useNavigate()
  const { openSignIn } = useClerk()

  const getShow = async () => {
    try {
      const { data } = await axios.get(`/api/show/${id}`)
      if(data.success){
        setShow({
          movie: data.movie,
          dateTime: data.dateTime
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  const getOccupiedSeats = async (showId) => {
    try {
      const { data } = await axios.get(`/api/booking/seat/${showId}`)
      if (data.success) {
        setOccupiedSeats(data.occupiedSeats)
      }
      else{
        toast.error(data.message) 
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (selectedTime) {
      getOccupiedSeats(selectedTime.showId)
      setSelectedSeats([])
    }
  }, [selectedTime])

  const handleSeatClick = (seatId) => {
    if(!selectedTime){
      return toast("Please select time first")
    }
    if (occupiedSeats.includes(seatId)) {
      return toast("This seat is already booked")
    }
    if(!selectedSeats.includes(seatId) && selectedSeats.length > 4){
      return toast("You can only select 5 seats")
    }
    setSelectedSeats(prev=> prev.includes(seatId) ? prev.filter(seat => seat !== seatId) : [...prev, seatId])
  }

  const handleBooking = async () => {
    
    try {
      const token = await getToken();

      if (!token) {
        toast.error("Please log in to book tickets")
        return openSignIn()
      }

      if (!selectedTime) return toast.error("Please select a time")
      if (selectedSeats.length === 0) return toast.error("Please select at least one seat")

      const { data } = await axios.post('/api/booking/create', {
        showId: selectedTime.showId,
        selectedSeats
      }, { headers: { Authorization: `Bearer ${token}` } })

      if (data.success) {
        navigate(`/payment/${data.bookingId}`, { state: { clientSecret: data.clientSecret } });
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error(error.message)
    }
  }

  const renderSeats = (row, count=9) => (
    <div key={row} className='flex gap-2 mt-2'>
      <div className='flex flex-wrap items-center justify-center gap-2'>
        {Array.from({length: count},(_,i)=>{
          const seatId = `${row}${i+1}`;
          const isOccupied = occupiedSeats.includes(seatId)
          return (
            <button key={seatId} onClick={()=>handleSeatClick(seatId)} disabled={isOccupied}
            className={`h-8 w-8 rounded border border-primary/60 cursor-pointer 
            ${selectedSeats.includes(seatId) ? 'bg-primary text-white' : ''}
            ${isOccupied ? 'bg-gray-600 border-gray-600 cursor-not-allowed text-primary' : ''}`}>
              {seatId}
            </button>
          );
        })}

      </div>
    </div>
  )

  useEffect(() => {
    getShow()
  },[id])

  return show ? (
    <div className="flex flex-col lg:flex-row px-4 md:px-16 lg:px-40 py-24 md:py-40 gap-10">
      {/* Available Timing - Top on mobile, Side on desktop */}
      <div className='w-full lg:w-64 shrink-0 bg-surface border border-white/5 rounded-2xl py-8 h-max lg:sticky lg:top-32 shadow-2xl'>
        <p className='text-lg font-serif font-semibold px-6 text-primary border-b border-white/5 pb-4 mb-4'>Show Timings</p>
        <div className='flex lg:flex-col overflow-x-auto lg:overflow-x-visible no-scrollbar px-2 lg:px-0 gap-2 lg:gap-1'>
          {show.dateTime[date]?.map((item)=>(
            <div key={item.time} onClick={()=> setSelectedTime(item)}
            className={`flex items-center gap-3 px-6 py-3 min-w-max lg:w-full rounded-xl lg:rounded-r-full lg:rounded-l-none cursor-pointer transition-all duration-300 ${selectedTime?.time ===
              item.time ? 'bg-primary text-black font-bold' : 'text-gray-400 hover:bg-primary/10 hover:text-white'}` }>
              <ClockIcon className='w-4 h-4'/>
              <p className='text-sm'>{isoTimeFormat(item.time)}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Seat Layout - Centered */}
      <div className='relative flex-1 flex flex-col items-center bg-surface/30 backdrop-blur-sm border border-white/5 rounded-3xl p-6 md:p-10 shadow-inner'>
          <BlurCircle top="-100px" left="-100px"/>
          <BlurCircle bottom="0" right="0"/>
          
          <div className='text-center mb-10'>
            <h1 className='text-3xl md:text-4xl font-serif font-bold text-white mb-2'>Choose Your Seats</h1>
            <p className='text-primary text-sm font-medium tracking-widest uppercase'>{show.movie.title}</p>
          </div>

          <div className='w-full max-w-2xl flex flex-col items-center'>
            <img src={assets.screenImage} alt="screen" className="w-full brightness-90 contrast-125" />
            <div className='w-full h-1 bg-primary/20 blur-sm rounded-full mt-1' />
            <p className='text-gray-500 text-[10px] md:text-xs mt-3 tracking-[0.5em] font-bold uppercase'>All eyes this way</p>
          </div>

          {/* Seat Grid with Scroll on Mobile */}
          <div className='w-full overflow-x-auto py-10 no-scrollbar cursor-grab active:cursor-grabbing'>
            <div className='flex flex-col items-center min-w-[500px] md:min-w-0'>
              <div className='flex flex-col items-center gap-2 mb-8'>
                {groupRows[0].map(row => renderSeats(row))}
              </div>
              <div className='grid grid-cols-2 gap-10 md:gap-20'>
                {groupRows.slice(1).map((group, idx) => (
                  <div key={idx} className='flex flex-col gap-2'>
                    {group.map(row => renderSeats(row))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className='flex flex-wrap justify-center gap-6 mt-6 text-xs text-gray-400 border-t border-white/5 pt-8 w-full'>
            <div className='flex items-center gap-2'>
              <div className='w-4 h-4 rounded border border-primary/60' />
              <span>Available</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-4 h-4 rounded bg-primary text-black flex items-center justify-center text-[8px]'>✓</div>
              <span>Selected</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-4 h-4 rounded bg-gray-700 text-gray-400' />
              <span>Sold</span>
            </div>
          </div>

          <div className='mt-12 flex flex-col items-center gap-4 w-full'>
            {selectedSeats.length > 0 && (
              <p className='text-sm text-gray-300'>
                Selected: <span className='text-primary font-bold'>{selectedSeats.join(", ")}</span>
              </p>
            )}
            <button onClick={handleBooking} 
            className='flex items-center justify-center gap-3 w-full sm:w-auto px-12 py-4 text-sm bg-primary hover:bg-primary-dull transition-all rounded-xl font-bold text-black cursor-pointer active:scale-95 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed'>
              Proceed to Payment
              <ArrowRightIcon strokeWidth={3} className="w-5 h-5"/>
            </button>
          </div>
      </div>
    </div>
  ) : (
    <Loading />
  )
}

export default SeatLayout