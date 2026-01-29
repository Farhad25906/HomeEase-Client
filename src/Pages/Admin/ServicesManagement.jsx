import { useState, useEffect } from 'react';
import { Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const ServicesManagement = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [servicesPerPage] = useState(10);

    // Fetch all services
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/services`);
                if (!response.ok) {
                    throw new Error('Failed to fetch services');
                }
                const data = await response.json();
                setServices(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    // Delete service function
    const handleDelete = async (serviceId) => {
        if (window.confirm('Are you sure you want to delete this service?')) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/services/${serviceId}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error('Failed to delete service');
                }

                // Remove the service from state
                setServices(services.filter(service => service._id !== serviceId));
            } catch (err) {
                setError(err.message);
            }
        }
    };

    // Get current services
    const indexOfLastService = currentPage * servicesPerPage;
    const indexOfFirstService = indexOfLastService - servicesPerPage;
    const currentServices = services.slice(indexOfFirstService, indexOfLastService);
    const totalPages = Math.ceil(services.length / servicesPerPage);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Generate page numbers with ellipsis
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            const halfVisible = Math.floor(maxVisiblePages / 2);
            let startPage = Math.max(currentPage - halfVisible, 1);
            let endPage = Math.min(currentPage + halfVisible, totalPages);

            if (currentPage <= halfVisible) {
                endPage = maxVisiblePages;
            } else if (currentPage >= totalPages - halfVisible) {
                startPage = totalPages - maxVisiblePages + 1;
            }

            if (startPage > 1) {
                pageNumbers.push(1);
                if (startPage > 2) {
                    pageNumbers.push('...');
                }
            }

            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i);
            }

            if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                    pageNumbers.push('...');
                }
                pageNumbers.push(totalPages);
            }
        }

        return pageNumbers;
    };

    const pageNumbers = getPageNumbers();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {error}</span>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Services Management</h1>

            <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Service Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Location
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Price
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Reviews
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentServices.map((service) => (
                            <tr key={service._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {service.name}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {service.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {service.location}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    ${service.price.$numberInt || service.price}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {service.reviews?.length || 0} reviews
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => handleDelete(service._id)}
                                        className="text-red-600 hover:text-red-900 mr-3"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                    {/* <button className="text-blue-600 hover:text-blue-900">
                                        <Edit className="h-5 w-5" />
                                    </button> */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center">
                <nav className="inline-flex rounded-md shadow">
                    <button
                        onClick={() => paginate(Math.max(currentPage - 1, 1))}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${currentPage === 1
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </button>

                    {pageNumbers.map((number, index) => (
                        <button
                            key={index}
                            onClick={() => typeof number === 'number' ? paginate(number) : null}
                            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${number === currentPage
                                    ? 'bg-[#68b5c2] text-white'
                                    : number === '...'
                                        ? 'bg-white text-gray-700 cursor-default'
                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                            disabled={number === '...'}
                        >
                            {number}
                        </button>
                    ))}

                    <button
                        onClick={() => paginate(Math.min(currentPage + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${currentPage === totalPages
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </nav>
            </div>
        </div>
    );
};

export default ServicesManagement;