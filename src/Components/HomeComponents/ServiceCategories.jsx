import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import DynamicHeader from "../SharedComponets/DynamicHeader";

const ServiceCategories = () => {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/categories`);
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const displayedCategories = showAllCategories ? categories : categories.slice(0, 6);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#68b5c2] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading categories...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded inline-block">
            <strong>Error:</strong> {error}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600">No categories available at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <DynamicHeader title="Popular Service Categories" />
          <p className="mt-4 text-lg text-gray-600">Browse through our most requested service categories</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayedCategories.map((category) => (
            <div key={category._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
              <a href="#" className="block p-6">
                <div className="flex items-center">
                  <span className="text-4xl mr-4">{category.icon || '🔧'}</span>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-[#68b5c2] mt-1">
                      {category.popularServices?.length || 0}+ Services
                    </p>
                    {category.description && (
                      <p className="text-gray-500 text-sm mt-1 line-clamp-1">
                        {category.description}
                      </p>
                    )}
                  </div>
                  <ArrowRight className="ml-auto h-5 w-5 text-gray-400" />
                </div>
              </a>
            </div>
          ))}
        </div>

        {categories.length > 6 && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="bg-[#68b5c2] hover:bg-[#5aa4b1] text-white px-6 py-3 rounded-md font-medium transition-colors"
            >
              {showAllCategories ? 'Show Less Categories' : 'Browse All Categories'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ServiceCategories;