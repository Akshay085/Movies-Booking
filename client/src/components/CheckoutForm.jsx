import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const CheckoutForm = ({ amount, currency }) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/loading/my-bookings`,
            },
        });

        if (error) {
            toast.error(error.message);
        }
        
        setIsProcessing(false);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-4">
            <div className="bg-[#1a1a1a] p-4 rounded-lg border border-white/10">
                <PaymentElement />
            </div>
            
            <button
                disabled={isProcessing || !stripe || !elements}
                className={`w-full py-3 rounded-md font-semibold text-black bg-primary hover:bg-primary/90 transition flex justify-center items-center gap-2 ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
                {isProcessing ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                    </>
                ) : (
                    `Pay ${currency}${amount}`
                )}
            </button>
        </form>
    );
};

export default CheckoutForm;
