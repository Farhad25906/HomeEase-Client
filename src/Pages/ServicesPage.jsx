import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Star,
  MapPin,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import UseAdmin from "../hooks/useAdmin";
import UseProvider from "../hooks/UseProvider";

const ServicesPage = () => {
  // User role checks
  const [isAdmin] = UseAdmin();
  const [isProvider] = UseProvider();

  // State for filters
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [priceFilter, setPriceFilter] = useState("All Prices");
  const [ratingFilter, setRatingFilter] = useState("All Ratings");
  const [sortBy, setSortBy] = useState("Recommended");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [currentServiceReviews, setCurrentServiceReviews] = useState([]);

  // State for services and categories
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState(["All Categories"]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [servicesPerPage] = useState(6);

  // Calculate average rating from reviews array
  const calculateAverageRating = (reviews) => {
    if (!Array.isArray(reviews) || reviews.length === 0) return 0;
    const sum = reviews.reduce(
      (total, review) => total + (review.rating || 0),
      0
    );
    const average = sum / reviews.length;
    return Math.round(average * 2) / 2;
  };
  const openReviewsModal = (reviews) => {
    setCurrentServiceReviews(reviews);
    setIsReviewsModalOpen(true);
  };
  // Fetch services and categories from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch categories
        const categoriesResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/categories`
        );
        if (!categoriesResponse.ok)
          throw new Error("Failed to fetch categories");
        const categoriesData = await categoriesResponse.json();
        const categoryNames = [
          "All Categories",
          ...categoriesData.map((cat) => cat.name || ""),
        ];
        setCategories(categoryNames);

        // Fetch services
        const servicesResponse = await fetch(`${import.meta.env.VITE_API_URL}/services`);
        if (!servicesResponse.ok) throw new Error("Failed to fetch services");
        const servicesData = await servicesResponse.json();

        setServices(servicesData);
        setFilteredServices(servicesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters whenever any filter changes
  useEffect(() => {
    let results = [...services];

    // Apply category filter
    if (categoryFilter !== "All Categories") {
      results = results.filter(
        (service) => service?.category === categoryFilter
      );
    }

    // Apply price filter
    if (priceFilter !== "All Prices") {
      switch (priceFilter) {
        case "$0 - $50":
          results = results.filter((service) => (service?.price || 0) <= 50);
          break;
        case "$50 - $100":
          results = results.filter(
            (service) =>
              (service?.price || 0) > 50 && (service?.price || 0) <= 100
          );
          break;
        case "$100 - $200":
          results = results.filter(
            (service) =>
              (service?.price || 0) > 100 && (service?.price || 0) <= 200
          );
          break;
        case "$200+":
          results = results.filter((service) => (service?.price || 0) > 200);
          break;
      }
    }

    // Apply rating filter
    if (ratingFilter !== "All Ratings") {
      const minRating = parseFloat(ratingFilter.split(" ")[0]);
      results = results.filter(
        (service) => calculateAverageRating(service?.reviews) >= minRating
      );
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (service) =>
          (service?.title || "").toLowerCase().includes(query) ||
          (service?.description || "").toLowerCase().includes(query) ||
          (service?.provider || "").toLowerCase().includes(query)
      );
    }

    // Apply location filter
    if (locationQuery) {
      const query = locationQuery.toLowerCase();
      results = results.filter((service) =>
        (service?.location || "").toLowerCase().includes(query)
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "Price: Low to High":
        results.sort((a, b) => (a?.price || 0) - (b?.price || 0));
        break;
      case "Price: High to Low":
        results.sort((a, b) => (b?.price || 0) - (a?.price || 0));
        break;
      case "Top Rated":
        results.sort(
          (a, b) =>
            calculateAverageRating(b?.reviews) -
            calculateAverageRating(a?.reviews)
        );
        break;
      case "Most Popular":
        results.sort(
          (a, b) =>
            (Array.isArray(b?.reviews) ? b.reviews.length : 0) -
            (Array.isArray(a?.reviews) ? a.reviews.length : 0)
        );
        break;
    }

    setFilteredServices(results);
    setCurrentPage(1);
  }, [
    services,
    categoryFilter,
    priceFilter,
    ratingFilter,
    sortBy,
    searchQuery,
    locationQuery,
  ]);

  // Pagination logic
  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = filteredServices.slice(
    indexOfFirstService,
    indexOfLastService
  );
  const totalPages = Math.ceil(filteredServices.length / servicesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const priceRanges = [
    "All Prices",
    "$0 - $50",
    "$50 - $100",
    "$100 - $200",
    "$200+",
  ];

  const ratings = [
    "All Ratings",
    "4.5 & up",
    "4.0 & up",
    "3.5 & up",
    "3.0 & up",
  ];

  const sortOptions = [
    "Recommended",
    "Price: Low to High",
    "Price: High to Low",
    "Top Rated",
    "Most Popular",
  ];

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const clearFilters = () => {
    setCategoryFilter("All Categories");
    setPriceFilter("All Prices");
    setRatingFilter("All Ratings");
    setSortBy("Recommended");
    setSearchQuery("");
    setLocationQuery("");
  };

  const renderStars = (rating) => {
    const roundedRating = Math.round(rating * 2) / 2;
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < Math.floor(roundedRating)
                ? "text-yellow-400 fill-current"
                : i < roundedRating
                  ? "text-yellow-400 fill-current opacity-80" // Half star
                  : "text-gray-300"
              }`}
          />
        ))}
        <span className="ml-1 text-gray-800 font-medium">
          {roundedRating.toFixed(1)}
        </span>
      </div>
    );
  };

  const renderPagination = () => {
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

      if (startPage > 1) pageNumbers.push(1);
      if (startPage > 2) pageNumbers.push("...");

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPages - 1) pageNumbers.push("...");
      if (endPage < totalPages) pageNumbers.push(totalPages);
    }

    return (
      <div className="flex justify-center mt-8">
        <nav className="inline-flex rounded-md shadow">
          <button
            onClick={() => paginate(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className={`relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>

          {pageNumbers.map((number, index) => (
            <button
              key={index}
              onClick={() =>
                typeof number === "number" ? paginate(number) : null
              }
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${number === currentPage
                  ? "bg-[#68b5c2] text-white"
                  : number === "..."
                    ? "bg-white text-gray-700 cursor-default"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              disabled={number === "..."}
            >
              {number}
            </button>
          ))}

          <button
            onClick={() => paginate(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${currentPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </nav>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#68b5c2]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md mx-auto mt-8">
        <div className="flex justify-center mb-4">
          <svg
            className="h-16 w-16 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Error loading services
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-[#68b5c2] hover:bg-[#4a9ba8] text-white font-medium px-4 py-2 rounded-md"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#68b5c2] to-[#4a9ba8] pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-6">
            Find the Perfect Home Service
          </h1>

          <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row gap-4"
          >
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search for services..."
                className="w-full pl-10 pr-3 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#68b5c2]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative w-full md:w-1/4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Your location"
                className="w-full pl-10 pr-3 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#68b5c2]"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="bg-[#4a8a96] hover:bg-[#3a7a86] text-white px-8 py-3 rounded-lg font-medium"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Desktop Filters */}
        <div className="hidden md:flex items-center justify-between mb-6">
          <div className="flex space-x-4">
            {/* Category filter */}
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="appearance-none flex items-center justify-between w-48 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#68b5c2]"
              >
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>

            {/* Price range filter */}
            <div className="relative">
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="appearance-none flex items-center justify-between w-40 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#68b5c2]"
              >
                {priceRanges.map((range, index) => (
                  <option key={index} value={range}>
                    {range}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>

            {/* Rating filter */}
            <div className="relative">
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="appearance-none flex items-center justify-between w-40 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#68b5c2]"
              >
                {ratings.map((rating, index) => (
                  <option key={index} value={rating}>
                    {rating}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <span className="text-gray-600 mr-2">Sort by:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none flex items-center justify-between w-48 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#68b5c2]"
              >
                {sortOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Filters */}
        <div className="md:hidden mb-6">
          <button
            className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          >
            <span className="flex items-center">
              <Filter className="h-5 w-5 text-gray-500 mr-2" />
              <span className="font-medium text-gray-700">Filters & Sort</span>
            </span>
            <ChevronDown
              className={`h-5 w-5 text-gray-500 transition-transform ${mobileFiltersOpen ? "transform rotate-180" : ""
                }`}
            />
          </button>

          {mobileFiltersOpen && (
            <div className="mt-2 p-4 bg-white border border-gray-300 rounded-md shadow-sm">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#68b5c2]"
                  >
                    {categories.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price Range
                  </label>
                  <select
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#68b5c2]"
                  >
                    {priceRanges.map((range, index) => (
                      <option key={index} value={range}>
                        {range}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rating
                  </label>
                  <select
                    value={ratingFilter}
                    onChange={(e) => setRatingFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#68b5c2]"
                  >
                    {ratings.map((rating, index) => (
                      <option key={index} value={rating}>
                        {rating}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sort by
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#68b5c2]"
                  >
                    {sortOptions.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={clearFilters}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 rounded-md"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-700">
            Showing{" "}
            <span className="font-medium">{filteredServices.length}</span>{" "}
            services total,{" "}
            <span className="font-medium">{currentServices.length}</span> on
            this page
          </p>

          {filteredServices.length > 0 && (
            <button
              onClick={clearFilters}
              className="text-[#4a8a96] hover:text-[#3a7a86] text-sm font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Services Grid */}
        {currentServices.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentServices.map((service) => (
                <div
                  key={service._id || service.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-duration-300"
                >
                  <div className="relative">
                    <img
                      src={service?.image || "/api/placeholder/400/300"}
                      alt={service?.title || "Service image"}
                      className="w-full h-48 object-cover"
                    />
                    {service?.badges && service.badges.length > 0 && (
                      <div className="absolute top-2 left-2 flex flex-wrap gap-2">
                        {service.badges.map((badge, index) => (
                          <span
                            key={index}
                            className={`text-xs font-semibold px-2 py-1 rounded ${badge === "Top Rated"
                                ? "bg-yellow-500 text-white"
                                : badge === "Featured"
                                  ? "bg-[#68b5c2] text-white"
                                  : badge === "Emergency Service"
                                    ? "bg-red-600 text-white"
                                    : "bg-gray-700 text-white"
                              }`}
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 bg-white rounded-full py-1 px-3 text-sm font-bold text-gray-900">
                      ${service?.price || 0}
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center mb-2">
                      <span className="px-2 py-1 bg-[#e0f2f5] text-[#4a8a96] text-xs font-medium rounded">
                        {service?.category || "Uncategorized"}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-[#68b5c2]">
                      {service?.name || "Untitled Service"}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {service?.description || "No description available"}
                    </p>

                    <div className="flex items-center mb-3">
                      <div className="flex-shrink-0">
                        <img
                          src={
                            service?.providerImage || "/api/placeholder/50/50"
                          }
                          alt={service?.email || "Provider"}
                          className="h-6 w-6 rounded-full"
                        />
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        {service?.email || "Unknown Provider"}
                      </span>
                    </div>

                    <div className="flex items-center mb-3">
                      <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-600">
                        {service?.location || "Location not specified"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      {renderStars(calculateAverageRating(service?.reviews))}
                      <span className="text-gray-500 text-sm">
                        {Array.isArray(service?.reviews)
                          ? service.reviews.length
                          : 0}{" "}
                        reviews
                      </span>
                    </div>


                    {!isAdmin && !isProvider && (
                      <div className="mt-4 space-y-2">
                        <button
                          onClick={() =>
                            (window.location.href = `/booking/${service?._id}`)
                          }
                          className="w-full bg-[#68b5c2] hover:bg-[#4a9ba8] text-white font-medium py-2 rounded-md"
                        >
                          Book Now
                        </button>

                        {Array.isArray(service?.reviews) &&
                          service.reviews.length > 0 && (
                            <button
                              onClick={() => openReviewsModal(service.reviews)}
                              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 rounded-md"
                            >
                              See Reviews
                            </button>
                          )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {renderPagination()}
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="flex justify-center mb-4">
              <svg
                className="h-16 w-16 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No services found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search or filter to find what you're looking
              for.
            </p>
            <button
              onClick={clearFilters}
              className="bg-[#68b5c2] hover:bg-[#4a9ba8] text-white font-medium px-4 py-2 rounded-md"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
      {/* Reviews Modal */}
      {isReviewsModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  Customer Reviews
                </h3>
                <button
                  onClick={() => setIsReviewsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {currentServiceReviews.length > 0 ? (
                <div className="space-y-4">
                  {currentServiceReviews.map((review, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-200 pb-4 last:border-0"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">
                            {review.reviewerEmail}
                          </p>
                          <div className="flex items-center mt-1">
                            {renderStars(review.rating)}
                            <span className="text-xs text-gray-500 ml-2">
                              {new Date(review.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="mt-2 text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No reviews available
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
