import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

const MyReviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentReview, setCurrentReview] = useState(null);
  const [editedReview, setEditedReview] = useState({
    rating: 0,
    comment: "",
  });

  useEffect(() => {
    if (user?.email) {
      fetchMyReviews();
    }
  }, [user?.email]);

  const fetchMyReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/services/reviews/${user.email}`
      );
      setReviews(Array.isArray(response?.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      setError("Failed to load your reviews");
      toast.error("Failed to load your reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (review) => {
    setCurrentReview(review);
    setEditedReview({
      rating: review.review.rating,
      comment: review.review.comment,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (serviceId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        // Get the current service data first
        const serviceResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/services/${serviceId}`
        );
        const currentService = serviceResponse.data;
        const existingReviews = currentService.reviews || [];

        // Filter out the review to delete
        const updatedReviews = existingReviews.filter(
          (r) => r.reviewerEmail !== user.email
        );

        // Update the service with the modified reviews array
        await axios.put(`${import.meta.env.VITE_API_URL}/services/${serviceId}`, {
          reviews: updatedReviews,
        });

        toast.success("Review deleted successfully");
        fetchMyReviews(); // Refresh the list
      } catch (error) {
        console.error("Failed to delete review:", error);
        toast.error("Failed to delete review");
      }
    }
  };

  const handleUpdateReview = async () => {
    try {
      // Get the current service data first
      const serviceResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/services/${currentReview.serviceId}`
      );
      const currentService = serviceResponse.data;
      const existingReviews = currentService.reviews || [];

      // Find the index of the review to update
      const reviewIndex = existingReviews.findIndex(
        (r) => r.reviewerEmail === user.email
      );

      if (reviewIndex !== -1) {
        // Create the updated review object
        const updatedReview = {
          reviewerEmail: user.email,
          rating: editedReview.rating,
          comment: editedReview.comment,
          date: existingReviews[reviewIndex].date, // Keep the original date
        };

        // Create a new reviews array with the updated review
        const updatedReviews = [...existingReviews];
        updatedReviews[reviewIndex] = updatedReview;

        // Update the service with the modified reviews array
        await axios.put(
          `${import.meta.env.VITE_API_URL}/services/${currentReview.serviceId}`,
          {
            reviews: updatedReviews,
          }
        );

        toast.success("Review updated successfully");
        setIsModalOpen(false);
        fetchMyReviews(); // Refresh the list
      } else {
        toast.error("Review not found");
      }
    } catch (error) {
      console.error("Failed to update review:", error);
      toast.error("Failed to update review");
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        {error}
        <button
          onClick={fetchMyReviews}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8">
        You haven't reviewed any services yet.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Reviews</h1>

      <div className="grid gap-6">
        {reviews.map((item) => (
          <div
            key={`${item.serviceId}-${item.review.date}`}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{item.serviceName}</h3>
                <div className="flex items-center mt-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-xl ${i < item.review.rating
                          ? "text-yellow-400"
                          : "text-gray-300"
                        }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-gray-600">{item.review.comment}</p>
                <p className="mt-2 text-sm text-gray-500">
                  Reviewed on: {new Date(item.review.date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditClick(item)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <FaEdit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(item.serviceId)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Review Modal */}
      {isModalOpen && currentReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Review</h2>
            <div className="mb-4">
              <label className="block mb-2">Rating</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() =>
                      setEditedReview({ ...editedReview, rating: star })
                    }
                    className={`text-2xl ${star <= editedReview.rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                      }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block mb-2">Comment</label>
              <textarea
                value={editedReview.comment}
                onChange={(e) =>
                  setEditedReview({ ...editedReview, comment: e.target.value })
                }
                className="w-full p-2 border rounded"
                rows="4"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateReview}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReviews;