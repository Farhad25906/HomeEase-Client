import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useLocation } from 'react-router-dom';
import CheckoutForm from './CheckoutForm';
import DynamicHeader from '../Components/SharedComponets/DynamicHeader';

const Payments = () => {
    const stripePromise = loadStripe('pk_test_51QTn4bCDA6WzUssxYnsLA1dBCEhEipwTPRuMn1xnSiKIlVCG5hPGtOib6FxU52JFchCr3runqi1pjI3Wa99NHLi200TvcaAkCR');
    const location = useLocation();
    const { bookingData } = location.state || {};

    if (!bookingData) {
        return <p className="text-center text-red-500 mt-10">No booking data found. Please try again.</p>;
    }

    const {
        serviceDetails,
        date,
        time,
        address,
        instructions,
        totalAmount
    } = bookingData;

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <DynamicHeader title="Payments"/>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Booking Summary */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold mb-4 text-[#68b5c2]">Booking Summary</h2>
                    <div className="flex items-start mb-4">
                        <img 
                            src={serviceDetails.image} 
                            alt={serviceDetails.title}
                            className="w-20 h-20 object-cover rounded-md mr-4"
                        />
                        <div>
                            <h3 className="font-semibold">{serviceDetails.title}</h3>
                            <p className="text-gray-600">{serviceDetails.category}</p>
                            <p className="font-bold">${serviceDetails.price}</p>
                        </div>
                    </div>
                    <p className="mb-2"><strong>Service Address:</strong> {address}</p>
                    <p className="mb-2"><strong>Date:</strong> {date}</p>
                    <p className="mb-2"><strong>Time:</strong> {time}</p>
                    <p className="mb-2"><strong>Total Amount:</strong> ${totalAmount}</p>
                    {instructions && (
                        <p className="mb-2"><strong>Special Instructions:</strong> {instructions}</p>
                    )}
                </div>

                {/* Complete Payment */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold mb-4 text-[#68b5c2]">Complete Payment</h2>
                    <Elements stripe={stripePromise}>
                        <CheckoutForm bookingData={bookingData} />
                    </Elements>
                </div>
            </div>
        </div>
    );
};

export default Payments;