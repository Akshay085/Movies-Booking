import React, { useEffect, useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import Loading from '../components/Loading'
import BlurCircle from '../components/BlurCircle'
import { motion } from 'framer-motion'
import timeFormat from '../lib/timeFormat'
import dateFormat from '../lib/dateFormat'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import CheckoutForm from '../components/CheckoutForm'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Payment = () => {
    const { bookingId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { axios, getToken, image_base_url, currency } = useAppContext();
    
    const [booking, setBooking] = useState(null);
    const [clientSecret, setClientSecret] = useState(location.state?.clientSecret || null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const token = await getToken();
                const { data } = await axios.get(`/api/booking/${bookingId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (data.success) {
                    setBooking(data.booking);
                    if (data.clientSecret) {
                        setClientSecret(data.clientSecret);
                    }
                } else {
                    navigate('/my-bookings');
                }
            } catch (error) {
                console.error("Failed to fetch booking", error);
                navigate('/my-bookings');
            } finally {
                setIsLoading(false);
            }
        };

        fetchBooking();
    }, [bookingId]);

    if (isLoading || !booking || !clientSecret) return <Loading />;

    const options = {
        clientSecret,
        appearance: {
            theme: 'night',
            variables: {
                colorPrimary: '#eab308', // Using the gold/yellow primary color typical for cinematic apps
                colorBackground: '#1a1a1a',
                colorText: '#ffffff',
                colorDanger: '#df1b41',
                fontFamily: 'system-ui, sans-serif',
                borderRadius: '8px',
            }
        },
    };

    return (
        <div className="relative min-h-[80vh] px-6 md:px-16 lg:px-40 pt-30 md:pt-40 pb-20 overflow-hidden">
            <BlurCircle top="100px" left="-100px" />
            <BlurCircle bottom="0px" right="-100px" />
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-5xl mx-auto"
            >
                <h1 className="text-3xl font-serif font-semibold mb-8 text-primary text-center md:text-left">
                    Complete Your Payment
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Left Side: Booking Summary */}
                    <motion.div 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-surface/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col h-max"
                    >
                        <h2 className="text-xl font-semibold mb-6">Booking Summary</h2>
                        <div className="flex gap-4">
                            <img 
                                src={image_base_url + booking.show.movie.poster_path} 
                                alt={booking.show.movie.title}
                                className="w-24 md:w-32 rounded-lg object-cover shadow-lg"
                            />
                            <div className="flex flex-col justify-center">
                                <h3 className="text-2xl font-bold text-primary">{booking.show.movie.title}</h3>
                                <p className="text-gray-400 text-sm mt-1">{timeFormat(booking.show.movie.runtime)}</p>
                                <p className="text-gray-300 mt-2">{dateFormat(booking.show.showDateTime)}</p>
                            </div>
                        </div>

                        <div className="mt-8 space-y-4 border-t border-white/10 pt-6">
                            <div className="flex justify-between items-center text-gray-300">
                                <span>Seats Selected</span>
                                <span className="font-semibold text-white">{booking.bookedSeats.join(", ")}</span>
                            </div>
                            <div className="flex justify-between items-center text-gray-300">
                                <span>Total Tickets</span>
                                <span className="font-semibold text-white">{booking.bookedSeats.length}</span>
                            </div>
                            <div className="flex justify-between items-center text-xl mt-4 pt-4 border-t border-white/10">
                                <span className="font-semibold">Total Amount</span>
                                <span className="font-bold text-primary">{currency}{booking.amount}</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Side: Stripe Elements */}
                    <motion.div 
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="bg-surface border border-white/10 rounded-2xl p-6 shadow-2xl"
                    >
                        <Elements stripe={stripePromise} options={options}>
                            <CheckoutForm amount={booking.amount} currency={currency} />
                        </Elements>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    )
}

export default Payment
