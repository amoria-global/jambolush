'use client';

import React, { useState, useMemo } from 'react';

const ReviewsPage = () => {
  const overallRating = 4.7;
  const totalReviews = 10;

  const [sortOrder, setSortOrder] = useState('Most relevant');

  const ratingsBreakdown = [
    { label: 'Accuracy', value: 4.9 },
    { label: 'Cleanliness', value: 4.5 },
    { label: 'Check-in', value: 4.7 },
    { label: 'Communication', value: 4.6 },
    { label: 'Location', value: 4.8 },
    { label: 'Value', value: 5.0 }
  ];

  const reviews = [
    { id: 1, user: 'Uwitonze Pacific', date: '2025-07-13', rating: 5, text: 'The location was great and the check-in was straightforward. The host\'s efforts to address concerns during the stay are appreciated.' },
    { id: 2, user: 'Uwitonze Pacific', date: '2020-06-20', rating: 4, text: 'Quiet and secure. Kitchen was small but functional. Easy check-in process. Highly recommend.' },
    { id: 3, user: 'Uwitonze Pacific', date: '2025-06-03', rating: 3, text: 'Peaceful location, but a few maintenance issues during the stay. Host was responsive though.' },
    { id: 4, user: 'Uwitonze Pacific', date: '2025-07-01', rating: 5, text: 'Very comfortable stay. The neighborhood is peaceful and safe.' },
    { id: 5, user: 'Uwitonze Pacific', date: '2025-07-17', rating: 4, text: 'Hosts were responsive and helpful, would stay again.' },
    { id: 6, user: 'Uwitonze Pacific', date: '2025-07-24', rating: 5, text: 'Loved the clean environment and easy check-in process.' },
    { id: 7, user: 'Uwitonze Pacific', date: '2025-07-29', rating: 3, text: 'Affordable and decent, but a bit noisy at night.' },
    { id: 8, user: 'Uwitonze Pacific', date: '2025-07-30', rating: 5, text: 'Perfect location and excellent communication with the host.' },
    { id: 9, user: 'Uwitonze Pacific', date: '2025-07-31', rating: 4, text: 'Quiet and relaxing stay. I highly recommend this place.' },
    { id: 10, user: 'Uwitonze Pacific', date: '2025-08-02', rating: 5, text: 'Amazing experience! Everything was spotless and comfortable.' }
  ];

  const sortedReviews = useMemo(() => {
    const copy = [...reviews];
    switch (sortOrder) {
      case 'Newest first':
        return copy.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      case 'Highest rating':
        return copy.sort((a, b) => b.rating - a.rating);
      case 'Lowest rating':
        return copy.sort((a, b) => a.rating - b.rating);
      default:
        return copy;
    }
  }, [sortOrder]);

  const renderStars = (rating: number) => {
    const stars = [];
    const roundedRating = Math.round(rating);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={i < roundedRating ? 'text-yellow-400' : 'text-gray-300'}>
          ⭐
        </span>
      );
    }
    return stars;
  };

  const getRatingIcon = (label: string) => {
    switch (label) {
      case 'Accuracy': return <span>✨</span>;
      case 'Cleanliness': return <span>🛡️</span>;
      case 'Check-in': return <span>🤝</span>;
      case 'Communication': return <span>🏆</span>;
      case 'Location': return <span>📍</span>;
      case 'Value': return <span>💰</span>;
      default: return null;
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 p-4 font-sans relative">
      <button
        aria-label="Close reviews panel"
        className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-200 transition-colors duration-200 text-gray-500 text-xl"
      >
        ×
      </button>

      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-7xl w-full flex flex-col lg:flex-row space-y-8 lg:space-y-0 lg:space-x-8">
        {/* Left Column */}
        <div className="lg:w-1/3 space-y-8">
          <div>
            <h3 className="text-lg font-semibold">Overall Ratings</h3>
            <div className="flex items-center space-x-2">
              <span className="text-3xl font-bold">{overallRating}</span>
              <div className="flex">{renderStars(overallRating)}</div>
            </div>
            <p className="text-gray-600">{totalReviews} reviews</p>
          </div>

          <div className="space-y-4">
            {ratingsBreakdown.map((rating) => (
              <div key={rating.label}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center space-x-2">
                    {getRatingIcon(rating.label)}
                    <span className="text-sm font-medium">{rating.label}</span>
                  </div>
                  <span className="text-sm text-gray-600">{rating.value}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gray-800 h-2 rounded-full"
                    style={{ width: `${(rating.value / 5) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:w-2/3 space-y-6">
          <header className="flex items-center justify-between border-b pb-4 mb-4">
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-bold">{totalReviews} reviews</h3>
              <a href="#" className="text-blue-600 text-sm hover:underline">Back</a>
            </div>
            <div className="relative">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                aria-label="Sort reviews"
                className="appearance-none bg-gray-100 pl-4 pr-10 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                <option>Most relevant</option>
                <option>Newest first</option>
                <option>Highest rating</option>
                <option>Lowest rating</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 text-sm">
                ▼
              </div>
            </div>
          </header>

          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search Review"
              aria-label="Search reviews"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
              🔍
            </div>
          </div>

          <div className="space-y-6 max-h-[80vh] overflow-y-auto">
            {sortedReviews.map((review) => (
              <div key={review.id} className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold">
                  {review.user.charAt(0)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{review.user}</span>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  <div className="flex space-x-1">{renderStars(review.rating)}</div>
                  <p className="text-gray-700 leading-relaxed">{review.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;
