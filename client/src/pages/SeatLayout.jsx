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
    <div className="flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-30 md:pt-50">
      {/* Available Timing */}
      <div className='w-60 bg-surface border border-white/5 rounded-lg py-10 h-max md:sticky md:top-30 shadow-2xl'>
        <p className='text-lg font-serif font-semibold px-6 text-primary'>Available Timing</p>
        <div className='mt-5 space-y-1'>
          {show.dateTime[date]?.map((item)=>(
            <div key={item.time} onClick={()=> setSelectedTime(item)}
            className={`flex items-center gap-2 px-6 py-2 w-max rounded-r-md cursor-pointer transition ${selectedTime?.time ===
              item.time ? 'bg-primary text-black' : 'hover:bg-primary/10'}` }>
              <ClockIcon className='w-4 h-4'/>
              <p className='text-sm'>{isoTimeFormat(item.time)}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Seat Layout */}
      <div className='relative flex-1 flex flex-col items-center max-md:mt-16'>
          <BlurCircle top="-100px" left="-100px"/>
          <BlurCircle bottom="0" right="0"/>
          <h1 className='text-3xl font-serif font-semibold mb-6 text-primary text-center'>Select your seat</h1>
          <img src={assets.screenImage} alt="screen" className="brightness-75" />
          <p className='text-gray-400 text-sm mb-6 tracking-widest'>SCREEN SIDE</p>
          <div className='flex flex-col items-center mt-10 text-xs text-gray-300'>
            <div className='grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-2 mb-6'>
              {groupRows[0].map(row => renderSeats(row))}
            </div>
            <div className='grid grid-cols-2 gap-11'>
              {groupRows.slice(1).map((group, idx) => (
                <div key={idx} >
                  {group.map(row => renderSeats(row))}
                </div>
              ))}
            </div>
          </div>
          <button onClick={handleBooking} 
          className='flex items-center gap-1 mt-20 px-10 py-3 text-sm bg-primary hover:bg-primary-dull 
          transition rounded-full font-medium cursor-pointer active:scale-95'>
            Proceed To Checkout
            <ArrowRightIcon strokeWidth={3} className="w-4 h-4"/>
          </button>
      </div>
    </div>
  ) : (
    <Loading />
  )
}

export default SeatLayout