import { useEffect, useState } from 'react';
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const CheckoutForm = ({ bookingData }) => {
    const [error, setError] = useState('');
    const [paymentIntentId, setPaymentIntentId] = useState('');
    const [clientSecret, setClientSecret] = useState('');
    const [loading, setLoading] = useState(false);
    const stripe = useStripe();
    const elements = useElements();
    const amount = bookingData.totalAmount;
    const navigate = useNavigate();
    console.log(bookingData);


    useEffect(() => {
        if (amount > 0) {
            axios.post(`${import.meta.env.VITE_API_URL}/payments/intent`, { amount })
                .then(res => {
                    setClientSecret(res.data.clientSecret);
                })
                .catch(err => {
                    toast.error('Failed to create payment intent');
                    console.error(err);
                });
        }
    }, [amount]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);

        try {
            const cardNumber = elements.getElement(CardNumberElement);
            if (!cardNumber) return;

            // Step 1: Create payment method
            const { error: paymentError, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardNumber,
            });

            if (paymentError) throw new Error(paymentError.message);

            // Step 2: Confirm payment
            const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: paymentMethod.id,
            });

            if (confirmError) throw new Error(confirmError.message);

            setPaymentIntentId(paymentIntent.id);

            const updatedBooking = {
                paymentId: paymentIntent.id,
                status: "Pending_Work"
            };

            await axios.patch(`${import.meta.env.VITE_API_URL}/bookings/${bookingData._id}`, updatedBooking);

            await axios.post(`${import.meta.env.VITE_API_URL}/payments`, {
                serviceProviderEmail: bookingData.serviceProviderEmail,
                bookingId: bookingData._id,
                paymentIntentId: paymentIntent.id,
                amount: bookingData.totalAmount,
                status: 'completed'
            });

            toast.success('Payment successful! Your booking is now pending work.');
            navigate('/dashboard/my-bookings');
        } catch (err) {
            console.error('Payment error:', err);
            setError(err.message);
            toast.error(err.message || 'Payment failed');

            try {
                await axios.patch(`${import.meta.env.VITE_API_URL}/bookings/${bookingData._id}`, {
                    status: "Payment_Failed"
                });
            } catch (updateError) {
                console.error('Failed to update booking status:', updateError);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-8 bg-white rounded-lg shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Card Number</label>
                    <div className="border border-gray-300 rounded-md px-3 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-[#68b5c2]">
                        <CardNumberElement
                            options={{
                                style: {
                                    base: {
                                        fontSize: '16px',
                                        color: '#424770',
                                        '::placeholder': { color: '#aab7c4' },
                                    },
                                    invalid: { color: '#9e2146' },
                                },
                            }}
                        />
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Expiration Date</label>
                        <div className="border border-gray-300 rounded-md px-3 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-[#68b5c2]">
                            <CardExpiryElement
                                options={{
                                    style: {
                                        base: {
                                            fontSize: '16px',
                                            color: '#424770',
                                            '::placeholder': { color: '#aab7c4' },
                                        },
                                        invalid: { color: '#9e2146' },
                                    },
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">CVC</label>
                        <div className="border border-gray-300 rounded-md px-3 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-[#68b5c2]">
                            <CardCvcElement
                                options={{
                                    style: {
                                        base: {
                                            fontSize: '16px',
                                            color: '#424770',
                                            '::placeholder': { color: '#aab7c4' },
                                        },
                                        invalid: { color: '#9e2146' },
                                    },
                                }}
                            />
                        </div>
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full bg-[#68b5c2] text-white font-bold py-3 rounded-md hover:bg-[#56a3af] transition disabled:bg-gray-400"
                    disabled={!stripe || !clientSecret || loading}
                >
                    {loading ? 'Processing...' : `Pay $${amount}`}
                </button>
                {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
                {paymentIntentId && (
                    <p className="text-green-600 text-sm mt-4">
                        Payment successful! Transaction ID: {paymentIntentId}
                    </p>
                )}
            </form>
        </div>
    );
};

export default CheckoutForm;