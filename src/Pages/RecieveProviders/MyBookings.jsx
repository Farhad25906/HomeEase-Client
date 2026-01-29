import axios from "axios";
import useAuth from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import { FaEllipsisV, FaStar } from "react-icons/fa";
import Modal from "react-modal";
import Loader from "../../Components/SharedComponets/Loader";


const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [review, setReview] = useState({
    rating: 5,
    comment: "",
  });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        if (!user?.email) return;

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/bookings/receiver/${user.email}`
        );
        setBookings(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch bookings. Please try again.");
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user?.email]);

  const openModal = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setReview({ rating: 5, comment: "" });
  };

  const handleReviewSubmit = async () => {
    try {
      const serviceResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/services/${selectedBooking.serviceId}`
      );

      const currentService = serviceResponse.data;
      const existingReviews = currentService.reviews || [];

      // Update the service with the new review added to the array
      await axios.put(
        `${import.meta.env.VITE_API_URL}/services/${selectedBooking.serviceId}`,
        {
          reviews: [
            ...existingReviews,
            {
              reviewerEmail: user.email,
              rating: review.rating,
              comment: review.comment,
              date: new Date().toISOString(),
            }
          ]
        }
      );

      // Update local state
      setBookings(
        bookings.map((b) =>
          b._id === selectedBooking._id ? { ...b, status: "Reviewed" } : b
        )
      );

      closeModal();
      message.success("Review submitted successfully!");
    } catch (error) {
      console.error("Error submitting review:", error);
      message.error("Failed to submit review");
    }
  };

  // Combined loading check
  if (!user || loading) return <Loader />;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">Service</th>
              <th className="py-2 px-4 border">Provider</th>
              <th className="py-2 px-4 border">Date & Time</th>
              <th className="py-2 px-4 border">Amount</th>
              <th className="py-2 px-4 border">Status</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border">
                  <div className="flex items-center">
                    <img
                      src={booking.serviceDetails.image}
                      alt={booking.serviceDetails.category}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <span>{booking.serviceDetails.category}</span>
                  </div>
                </td>
                <td className="py-2 px-4 border">
                  {booking.serviceProviderEmail}
                </td>
                <td className="py-2 px-4 border">
                  {booking.date} at {booking.time}
                </td>
                <td className="py-2 px-4 border">
                  ${booking.totalAmount}
                </td>
                <td className="py-2 px-4 border">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${booking.status === "Pending_Work"
                        ? "bg-yellow-100 text-yellow-800"
                        : booking.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                  >
                    {booking.status}
                  </span>
                </td>
                <td className="py-2 px-4 border text-center">
                  <button
                    onClick={() => openModal(booking)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <FaEllipsisV />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="modal"
        overlayClassName="overlay"
      >
        {selectedBooking && (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">
              {selectedBooking.status === "Completed" || selectedBooking.status === "Reviewed"
                ? "Review Service Provider"
                : "Booking Details"}
            </h2>

            {selectedBooking.status === "Completed" || selectedBooking.status === "Reviewed" ? (
              <div>
                <div className="mb-4">
                  <label className="block mb-2">Rating</label>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={`text-2xl cursor-pointer ${star <= review.rating ? "text-yellow-500" : "text-gray-300"
                          }`}
                        onClick={() => setReview({ ...review, rating: star })}
                      />
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block mb-2">Review</label>
                  <textarea
                    className="w-full p-2 border rounded"
                    rows="4"
                    value={review.comment}
                    onChange={(e) =>
                      setReview({ ...review, comment: e.target.value })
                    }
                  ></textarea>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 border rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReviewSubmit}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Submit Review
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <h3 className="font-semibold">Service</h3>
                    <p>{selectedBooking.serviceDetails.category}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Provider</h3>
                    <p>{selectedBooking.serviceProviderEmail}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Date</h3>
                    <p>{selectedBooking.date}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Time</h3>
                    <p>{selectedBooking.time}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Address</h3>
                    <p>{selectedBooking.address}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Special Instructions</h3>
                    <p>{selectedBooking.instructions}</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      <style jsx global>{`
        .modal {
          position: absolute;
          top: 50%;
          left: 50%;
          right: auto;
          bottom: auto;
          margin-right: -50%;
          transform: translate(-50%, -50%);
          background: white;
          padding: 20px;
          border-radius: 8px;
          max-width: 600px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
        }
        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 1000;
        }
      `}</style>
    </div>
  );
};

export default MyBookings;