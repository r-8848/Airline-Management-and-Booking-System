import React, { useEffect, useState } from 'react';
import NavbarM from '../components/NavbarM';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { apiCall } from '../utils/api';

const Feedback = ({user}) => {
  const [formData, setFormData] = useState({
    firstImpression: '',
    hearAbout: '',
    missingAnything: '',
    rating: 0,
    recommend: 0,
    improvementSuggestions: '',
    favoriteFeature: ''
  });

  const [hoveredRating, setHoveredRating] = useState(0);
  const [hoveredRecommend, setHoveredRecommend] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRatingChange = (rating) => {
    setFormData((prevData) => ({
      ...prevData,
      rating,
    }));
  };

  const handleRecommendChange = (recommend) => {
    setFormData((prevData) => ({
      ...prevData,
      recommend,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await apiCall('/api/feedback', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      
      if (response.success) {
        setShowThankYou(true);
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        alert(response.message || 'Failed to submit feedback');
      }
    } catch (error) {
      console.error('There was an error submitting the feedback:', error);
      alert('Error submitting feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <NavbarM user={user}/>
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Thank You Modal */}
      {showThankYou && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-auto text-center animate-slideInRight">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
            <p className="text-gray-600">Your feedback has been submitted successfully. We appreciate your time!</p>
            <div className="mt-6">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full animate-pulse" style={{width: '100%'}}></div>
              </div>
              <p className="text-sm text-gray-500 mt-2">Redirecting to home...</p>
      </div>
        </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fadeIn">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full mb-4 animate-float">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">We'd love your feedback!</h1>
          <p className="text-xl text-gray-600">Help us improve your experience with <span className="gradient-text font-semibold">Flyhigh</span></p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 card-hover animate-slideInLeft">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* First Impression */}
            <div className="space-y-2">
              <label htmlFor="firstImpression" className="block text-lg font-semibold text-gray-900">
                What was your first impression when you entered the website?
              </label>
              <textarea 
                id="firstImpression" 
                name="firstImpression" 
                value={formData.firstImpression} 
                onChange={handleChange} 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none" 
                rows="3"
                placeholder="Tell us what caught your attention..."
                required 
              />
          </div>
          
            {/* How did you hear about us */}
            <div className="space-y-2">
              <label htmlFor="hearAbout" className="block text-lg font-semibold text-gray-900">
                How did you first hear about us?
              </label>
              <div className="relative">
                <select 
                  id="hearAbout" 
                  name="hearAbout" 
                  value={formData.hearAbout} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none cursor-pointer" 
                  required
                >
              <option value="">Select an option</option>
                  <option value="social_media">📱 Social Media</option>
                  <option value="search_engine">🔍 Search Engine</option>
                  <option value="friend">👥 Friend or Colleague</option>
                  <option value="advertisement">📢 Advertisement</option>
                  <option value="other">✨ Other</option>
            </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
          </div>

            {/* Rating */}
            <div className="space-y-2">
              <label className="block text-lg font-semibold text-gray-900">
                Rate your overall experience
              </label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingChange(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none transform transition-all hover:scale-110"
                  >
                    <svg 
                      className={`w-10 h-10 ${
                        star <= (hoveredRating || formData.rating) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'
                      }`} 
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </button>
                ))}
                <span className="ml-3 text-gray-600">
                  {formData.rating > 0 && (
                    <span className="font-medium">
                      {formData.rating === 1 && 'Poor'}
                      {formData.rating === 2 && 'Fair'}
                      {formData.rating === 3 && 'Good'}
                      {formData.rating === 4 && 'Very Good'}
                      {formData.rating === 5 && 'Excellent'}
                    </span>
                  )}
                </span>
              </div>
          </div>

            {/* Recommendation Scale */}
            <div className="space-y-2">
              <label className="block text-lg font-semibold text-gray-900">
                How likely are you to recommend Flyhigh to a friend?
                </label>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Not likely</span>
                <div className="flex space-x-2">
                  {[...Array(11)].map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleRecommendChange(i)}
                      onMouseEnter={() => setHoveredRecommend(i)}
                      onMouseLeave={() => setHoveredRecommend(0)}
                      className={`w-10 h-10 rounded-lg font-medium transition-all transform hover:scale-110 ${
                        i <= (hoveredRecommend !== 0 ? hoveredRecommend : formData.recommend)
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      {i}
                    </button>
                  ))}
                </div>
                <span className="text-sm text-gray-500">Very likely</span>
              </div>
            </div>

            {/* Favorite Feature */}
            <div className="space-y-2">
              <label htmlFor="favoriteFeature" className="block text-lg font-semibold text-gray-900">
                What's your favorite feature?
              </label>
              <input
                type="text"
                id="favoriteFeature"
                name="favoriteFeature"
                value={formData.favoriteFeature}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="e.g., Easy booking process, User interface..."
              />
            </div>

            {/* Missing anything */}
            <div className="space-y-2">
              <label htmlFor="missingAnything" className="block text-lg font-semibold text-gray-900">
                Is there anything missing on this page?
              </label>
              <textarea 
                id="missingAnything" 
                name="missingAnything" 
                value={formData.missingAnything} 
                onChange={handleChange} 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none" 
                rows="3"
                placeholder="Let us know what we can add..."
                required 
              />
            </div>

            {/* Improvement Suggestions */}
            <div className="space-y-2">
              <label htmlFor="improvementSuggestions" className="block text-lg font-semibold text-gray-900">
                Any suggestions for improvement?
              </label>
              <textarea 
                id="improvementSuggestions" 
                name="improvementSuggestions" 
                value={formData.improvementSuggestions} 
                onChange={handleChange} 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none" 
                rows="3"
                placeholder="We're always looking to improve..."
              />
          </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button 
                type="submit" 
                disabled={isSubmitting || formData.rating === 0}
                className="w-full py-4 px-6 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transform transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Submit Feedback'
                )}
              </button>
              {formData.rating === 0 && (
                <p className="text-sm text-red-600 mt-2 text-center">Please rate your experience before submitting</p>
              )}
            </div>
        </form>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 text-center animate-fadeIn">
          <p className="text-sm text-gray-500">
            <svg className="inline w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
            Your feedback is anonymous and secure
          </p>
        </div>
      </div>
    </div>
    {/* <Footer/> */}
    </>
  );
};

export default Feedback;
