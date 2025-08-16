'use client';

import React, { useState, useMemo } from 'react';

interface Review {
  id: number;
  name: string;
  date: string;
  stayInfo: string;
  rating: number;
  text: string;
  avatar: string;
}

interface RatingDistribution {
  stars: number;
  count: number;
}

interface SubCategoryRating {
  category: string;
  score: number;
}

const ReviewPage: React.FC = () => {
  const [filterValue, setFilterValue] = useState('Most relevant');
  const [searchQuery, setSearchQuery] = useState('');

  const reviews: Review[] = [
    {
      id: 1,
      name: "Moise caicedo",
      date: "3 months ago",
      stayInfo: "Stayed 3 nights",
      rating: 5,
      text: "My daughter and I had a wonderful time. The unit was clean and well-appointed with a beautiful view and comfortable bed. The location is great.",
      avatar: "https://i.pinimg.com/1200x/1a/6b/b4/1a6bb4a83cae143b81fce25632796c15.jpg"
    },
    {
      id: 2,
      name: "Enzo Fernandez",
      date: "4 months ago", 
      stayInfo: "Stayed 4 nights",
      rating: 5,
      text: "Great location, lovely host and the home was clean with lots of amenities",
      avatar: "https://i.pinimg.com/736x/10/29/c9/1029c9da2424ff502a1b3e5c856c7e51.jpg"
    },
    {
      id: 3,
      name: "cole palmer",
      date: "4 months ago",
      stayInfo: "Stayed 1 night", 
      rating: 5,
      text: "Great place, very clean. Great view of the lake!",
      avatar: "https://i.pinimg.com/736x/3f/5b/a4/3f5ba46c7a10110d11c4358f7c4436ab.jpg"
    },
    {
      id: 4,
      name: "Romeo Lavia",
      date: "5 months ago",
      stayInfo: "Stayed 2 nights",
      rating: 5,
      text: "This place is amazing! Beautiful views, clean, and modern with a beautiful lake view. Highly recommend!",
      avatar: "https://i.pinimg.com/1200x/69/fe/7e/69fe7e2242a2ceffe9b160c904b1b246.jpg"
    },
    {
      id: 5,
      name: "Liam Delap",
      date: "5 months ago",
      stayInfo: "Stayed 3 nights", 
      rating: 5,
      text: "Beautiful location, great host and very clean. Will definitely stay here again!",
      avatar: "https://i.pinimg.com/1200x/a3/74/9a/a3749ae6a10b4c25ab40b0ff4d206ef0.jpg"
    },
    {
      id: 6,
      name: "Estavao williamz",
      date: "6 months ago",
      stayInfo: "Stayed 4 nights",
      rating: 5,
      text: "Amazing place with incredible views and excellent hospitality from the host!",
      avatar: "https://i.pinimg.com/1200x/5f/c5/3b/5fc53b52fd0e4eff1a36322f474529cd.jpg"
    }
  ];

  const ratingDistribution: RatingDistribution[] = [
    { stars: 5, count: 28 },
    { stars: 4, count: 16 },
    { stars: 3, count: 10 },
    { stars: 2, count: 5 },
    { stars: 1, count: 2 }
  ];

  const subCategoryRatings: SubCategoryRating[] = [
    { category: "Accuracy", score: 4.9 },
    { category: "Cleanliness", score: 4.5 },
    { category: "Check-in", score: 4.7 },
    { category: "Communication", score: 4.6 },
    { category: "Location", score: 4.8 },
    { category: "Value", score: 5.0 }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Accuracy": return <i className="bi bi-check-circle-fill text-gray-700 mr-2 sm:mr-3" />;
      case "Cleanliness": return <i className="bi bi-brush text-gray-700 mr-2 sm:mr-3" />;
      case "Check-in": return <i className="bi bi-door-open text-gray-700 mr-2 sm:mr-3" />;
      case "Communication": return <i className="bi bi-chat-dots-fill text-gray-700 mr-2 sm:mr-3" />;
      case "Location": return <i className="bi bi-geo-alt-fill text-gray-700 mr-2 sm:mr-3" />;
      case "Value": return <i className="bi bi-star-fill text-gray-700 mr-2 sm:mr-3" />;
      default: return null;
    }
  };

  const overallRating = 4.8;
  const totalReviews = 30;

  const filteredReviews = useMemo(() => {
    return reviews.filter(review =>
      review.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const renderStars = (rating: number, size: 'sm' | 'md' = 'sm') => {
    const sizeClass = size === 'sm' ? 'text-base' : 'text-xl';
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map(star => (
          <i
            key={star}
            className={`bi ${star <= rating ? 'bi-star-fill text-blue-900' : 'bi-star text-gray-300'} ${sizeClass} mr-1`}
          />
        ))}
      </div>
    );
  };

  const getProgressPercentage = (count: number) => (count / totalReviews) * 100;

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 md:p-8 mt-2 mb-2 ml-1 mr-1 sm:mt-4 sm:mb-4 sm:ml-4 sm:mr-4">
      <div className="min-h-screen bg-gray-50 p-2 sm:p-4 md:p-8 mt-8 mb-2 ml-1 mr-1 sm:mb-4 sm:ml-4 sm:mr-4">

        {/* Header Section */}
        <div className="mb-4 mt-2 sm:mb-8 sm:mt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 sm:mb-6">
            <div className="flex items-center mb-2 md:mb-0">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-black rounded-full flex items-center justify-center mr-2 sm:mr-4">
                <div className="text-white text-xs sm:text-sm font-bold text-center">
                  <img src ="/favicon.ico" alt="Avatar" className="w-full h-full rounded-full object-cover" />
                </div>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">More reviews</h1>
            </div>
            
            <div className="relative mt-2 w-full md:w-auto">
              <select 
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent w-full md:w-auto"
              >
                <option>Most relevant</option>
                <option>Most recent</option>
                <option>Highest rated</option>
                <option>Lowest rated</option>
              </select>
              <i className="bi bi-chevron-down absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          
          <div className="relative w-full mt-3 sm:max-w-md">
            <i className="bi bi-search absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search reviews"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 sm:pl-10 sm:pr-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-3 lg:gap-8 gap-4 mt-4 sm:mt-6">
          {/* Sidebar Section */}
          <div className="lg:col-span-1 mt-2 sm:mt-4">
            <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6 lg:sticky lg:top-4">
              {/* Overall Rating */}
              <div className="mb-4 sm:mb-8">
                <div className="flex items-center mb-2 sm:mb-4">
                  <span className="text-2xl sm:text-3xl font-bold text-gray-900 mr-2">{overallRating}</span>
                  {renderStars(Math.round(overallRating), 'md')}
                </div>
                <p className="text-sm sm:text-base text-gray-600">30 reviews</p>
              </div>

              {/* Rating Distribution */}
              <div className="mb-4 sm:mb-8">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-4">
                Rating breakdown
              </h3>
              {ratingDistribution.map(rating => (
                <div
                  key={rating.stars}
                  className="flex items-center mb-2 sm:mb-3"
                >
                  <span className="w-6 sm:w-8 text-xs sm:text-sm text-gray-600 mr-2">
                    {rating.stars}
                  </span>
                  <i className="bi bi-star-fill w-4 h-4 text-blue-900 mr-2" />
                  <div className="flex-1 mx-2 sm:mx-3">
                    <div className="w-full bg-pink-100 rounded-full h-1.5 sm:h-2">
                      <div
                        className="bg-pink-500 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getProgressPercentage(rating.count)}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="w-6 sm:w-8 text-xs sm:text-sm text-gray-600 text-right">
                    {rating.count}
                  </span>
                </div>
              ))}
            </div>


              {/* Sub-category Ratings */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-4">Categories</h3>
                {subCategoryRatings.map(category => (
                  <div key={category.category} className="flex items-center justify-between mb-2 sm:mb-3 py-2 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center">
                      {getCategoryIcon(category.category)}
                      <span className="text-xs sm:text-sm text-gray-700">{category.category}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs sm:text-sm font-medium text-gray-900 mr-1 sm:mr-2">{category.score}</span>
                      <div className="flex">
                        {[1,2,3,4,5].map(star => (
                          <i
                            key={star}
                            className={`bi ${star <= Math.round(category.score) ? 'bi-star-fill text-blue-900' : 'bi-star text-gray-300'} w-3 h-3 sm:w-4 sm:h-4 mr-1`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Section */}
          <div className="lg:col-span-2 mt-2 sm:mt-4">
            <div className="space-y-3 sm:space-y-6">
              {filteredReviews.map(review => (
                <div key={review.id} className="bg-white rounded-lg shadow-sm p-3 sm:p-6 border border-gray-200">
                  <div className="flex items-start">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover mr-2 sm:mr-4"
                    />
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                        <div>
                          <h4 className="text-sm sm:text-base font-bold text-gray-900">{review.name}</h4>
                          <p className="text-xs sm:text-sm text-gray-600">{review.date} • {review.stayInfo}</p>
                        </div>
                        <div className="flex">
                          {[1,2,3,4,5].map(star => (
                            <i
                              key={star}
                              className={`bi ${star <= review.rating ? 'bi-star-fill text-blue-900' : 'bi-star text-gray-300'} w-3 h-3 sm:w-4 sm:h-4 mr-1`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{review.text}</p>
                    </div>
                  </div>
                </div>
              ))}

              {filteredReviews.length === 0 && (
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-8 text-center">
                  <p className="text-sm sm:text-base text-gray-500">No reviews found matching your search.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;
