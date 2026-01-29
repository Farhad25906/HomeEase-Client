import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import EditServiceModal from "../../Components/AdminComponents/EditServiceModal";
import useAuth from "../../hooks/useAuth";
import Loader from "../../Components/SharedComponets/Loader";

const MyServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showReviews, setShowReviews] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/services/my/${user.email}`
        );

        const safeServices = Array.isArray(response.data) ? response.data : [];

        setServices(safeServices);
        setError(null);
      } catch (err) {
        setError(err.message);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchServices();
    }
  }, [user?.email]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/services/${id}`);
        setServices(services.filter((service) => service._id !== id));
        toast.success("Service deleted successfully!");
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to delete service.");
        console.error("Error deleting service:", err);
      }
    }
  };

  const handleEdit = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleUpdate = async (updatedService) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/services/${updatedService._id}`,
        updatedService,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (
        response.data &&
        response.data.message === "Service updated successfully"
      ) {
        setServices(
          services.map((service) =>
            service._id === updatedService._id
              ? response.data.updatedService
              : service
          )
        );
        toast.success("Service updated successfully!");
        setIsModalOpen(false);
      } else {
        throw new Error(response.data?.message || "Update failed");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.details ||
        err.response?.data?.error ||
        "Failed to update service";
      toast.error(errorMessage);
      console.error("Detailed update error:", err.response?.data || err);
    }
  };

  // Toggle reviews display for a service
  const toggleReviews = (serviceId) => {
    if (showReviews === serviceId) {
      setShowReviews(null); // Close if already open
    } else {
      setShowReviews(serviceId); // Open for this service
    }
  };

  // Format date for better readability
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) return <Loader />;
  if (error)
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">No services found</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#68b5c2] text-white rounded hover:bg-cyan-400"
        >
          Retry
        </button>
      </div>
    );

  if (!loading && (!services || services.length === 0))
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No services found</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Services</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Popular
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {services?.map(
              (service) =>
                service && (
                  <>
                    <tr key={`row-${service._id}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {service.image && (
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={service.image}
                                alt={service.name || "Service image"}
                              />
                            </div>
                          )}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {service.name || "Unnamed service"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {service.description
                                ? `${service.description.substring(0, 50)}...`
                                : "No description"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {service.category || "Uncategorized"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${service.price || "0"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {service.duration || "Not specified"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${service.isPopular
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                            }`}
                        >
                          {service.isPopular ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center">
                        <button
                          onClick={() => handleEdit(service)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(service._id)}
                          className="text-red-600 hover:text-red-900 mr-4"
                        >
                          Delete
                        </button>
                        <div className="relative ml-2">
                          <button
                            onClick={() => toggleReviews(service._id)}
                            className="text-gray-600 hover:text-gray-900"
                            title="Show reviews"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <circle cx="10" cy="6" r="2" />
                              <circle cx="10" cy="10" r="2" />
                              <circle cx="10" cy="14" r="2" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                    {showReviews === service._id && (
                      <tr key={`reviews-${service._id}`}>
                        <td colSpan="6" className="px-6 py-4">
                          <div className="bg-gray-50 p-4 rounded-md">
                            <h3 className="text-lg font-medium mb-4">
                              Reviews for {service.name}
                            </h3>
                            {service.reviews && service.reviews.length > 0 ? (
                              <div className="space-y-4">
                                {service.reviews.map((review, index) => (
                                  <div
                                    key={`review-${index}`}
                                    className="bg-white p-4 rounded-lg shadow"
                                  >
                                    <div className="flex justify-between items-start mb-2">
                                      <span className="font-medium">
                                        {review.reviewerEmail}
                                      </span>
                                      <span className="text-sm text-gray-500">
                                        {formatDate(review.date)}
                                      </span>
                                    </div>
                                    <div className="flex items-center mb-2">
                                      <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                          <svg
                                            key={`star-${i}`}
                                            className={`w-4 h-4 ${i < review.rating
                                                ? "text-yellow-400"
                                                : "text-gray-300"
                                              }`}
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                          >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                          </svg>
                                        ))}
                                      </div>
                                      <span className="ml-2 text-sm font-medium text-gray-700">
                                        {review.rating}/5
                                      </span>
                                    </div>
                                    <p className="text-gray-700">
                                      {review.comment}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-500">
                                No reviews available for this service.
                              </p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                )
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && selectedService && (
        <EditServiceModal
          service={selectedService}
          onClose={() => setIsModalOpen(false)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default MyServices;