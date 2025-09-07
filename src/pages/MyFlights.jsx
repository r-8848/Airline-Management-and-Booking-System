import React, { useState, useEffect } from 'react';
import NavbarM from '../components/NavbarM';
import { useLocation, Link } from 'react-router-dom';
import Footer from '../components/Footer';

const MyFlights = ({user}) => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const location = useLocation();
  const data = location.state || {};

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/api/bookings');
        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }
        const flightsData = await response.json();
        // Use user.email if available, otherwise fall back to data.email
        const userEmail = user?.email || data.email;
        if (!userEmail) {
          console.error('No user email available');
          setFlights([]);
          return;
        }
        const filteredFlights = flightsData.filter(flight =>
          flight.email === userEmail
        );
        
        // Fetch airline logos
        const airlinesResponse = await fetch('http://localhost:3000/api/airlines');
        if (airlinesResponse.ok) {
          const airlinesData = await airlinesResponse.json();
          
          // Add airline logos to flights
          const flightsWithLogos = filteredFlights.map(flight => {
            const airline = airlinesData.find(a => a.flightName === flight.data.flightName);
            return {
              ...flight,
              airlineLogo: airline?.image || null
            };
          });
          
          setFlights(flightsWithLogos);
        } else {
        setFlights(filteredFlights);
        }
        
        console.log('User email:', userEmail);
        console.log('All bookings:', flightsData.length);
        console.log('Filtered bookings:', filteredFlights.length);
        
      } catch (error) {
        console.error('Error fetching flights:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [user?.email, data.email]);

  const getBookingStatus = (flight) => {
    const departureDate = new Date(flight.data.departureTime);
    const currentDate = new Date();
    
    // Check if flight is cancelled
    const allCancelled = flight.formData && flight.formData.every(passenger => passenger.status === 0);
    if (allCancelled) {
      return 'cancelled';
    }
    
    // Check if flight has departed
    if (departureDate < currentDate) {
      return 'completed';
    }
    
    // Otherwise it's upcoming
    return 'upcoming';
  };

  const categorizeFlights = () => {
    const categorized = {
      upcoming: [],
      completed: [],
      cancelled: []
    };
    
    flights.forEach(flight => {
      const status = getBookingStatus(flight);
      categorized[status].push(flight);
    });
    
    return categorized;
  };

  const categorizedFlights = categorizeFlights();
  const displayFlights = categorizedFlights[activeTab] || [];

  const handleCancel = (flight) => {
    alert(`Flight ${flight} has been canceled.`);
  };

  const formatDateTime = (dateTimeString) => {
    if (typeof dateTimeString !== 'string') return ["Invalid Date", "Invalid Time"];
    const [datePart, timePart] = dateTimeString.split('T');
    return [datePart, timePart];
  };

  const formatDate = (date) => {
    if (typeof date !== 'string') return "Invalid Date";
    const dateObj = new Date(date);
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return dateObj.toLocaleDateString('en-US', options);
  };

  const formatTime = (time) => {
    if (!time) return "Invalid Time";
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const calculateDuration = (departure, arrival) => {
    const dep = new Date(departure);
    const arr = new Date(arrival);
    const diff = arr - dep;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const getDaysUntilFlight = (departureTime) => {
    const departure = new Date(departureTime);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    departure.setHours(0, 0, 0, 0);
    const diff = departure - today;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    if (days > 1) return `In ${days} days`;
    return 'Past';
  };

  return (
    <>
      <NavbarM user={user}/>
      <div className='min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50'>
        {/* Hero Section */}
        <div className='bg-gradient-to-r from-purple-600 to-blue-600 text-white py-12'>
          <div className='container mx-auto px-4'>
            <h1 className='text-4xl font-bold text-center mb-2'>My Bookings</h1>
            <p className='text-center text-purple-100'>Track and manage all your flight bookings in one place</p>
          </div>
        </div>
        
        <div className='container mx-auto px-4 py-8'>
          {/* Tab Navigation */}
          <div className='flex justify-center mb-8 -mt-6'>
            <div className='bg-white rounded-full shadow-lg p-1 flex'>
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-6 py-3 rounded-full font-medium transition-all flex items-center gap-2 ${
                  activeTab === 'upcoming'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'></path>
                </svg>
                Upcoming ({categorizedFlights.upcoming.length})
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`px-6 py-3 rounded-full font-medium transition-all flex items-center gap-2 ${
                  activeTab === 'completed'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'></path>
                </svg>
                Completed ({categorizedFlights.completed.length})
              </button>
              <button
                onClick={() => setActiveTab('cancelled')}
                className={`px-6 py-3 rounded-full font-medium transition-all flex items-center gap-2 ${
                  activeTab === 'cancelled'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'></path>
                </svg>
                Cancelled ({categorizedFlights.cancelled.length})
              </button>
            </div>
          </div>

          {/* Flights List */}
          <div className='max-w-5xl mx-auto'>
            {loading ? (
              <div className='flex justify-center items-center h-64'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600'></div>
              </div>
            ) : displayFlights.length === 0 ? (
              <div className='text-center py-16'>
                <img src="/airplane.png" alt="No flights" className='w-32 h-32 mx-auto mb-4 opacity-50' />
                <p className='text-gray-500 text-lg'>No {activeTab} bookings found</p>
              </div>
            ) : (
              <div className='space-y-6'>
                {displayFlights.map((flight, index) => {
                  const [depDate, depTime] = formatDateTime(flight.data.departureTime);
                  const [arrDate, arrTime] = formatDateTime(flight.data.arrivalTime);
                  const status = getBookingStatus(flight);
                  const daysUntil = getDaysUntilFlight(flight.data.departureTime);
                  
                  return (
                    <div key={index} className='bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100'>
                      {/* Status Bar */}
                      <div className={`h-2 ${
                        status === 'cancelled' ? 'bg-red-500' : 
                        status === 'completed' ? 'bg-gray-500' : 
                        'bg-gradient-to-r from-purple-600 to-blue-600'
                      }`}></div>
                      
                      {/* Flight Header */}
                      <div className='px-6 py-4 bg-gray-50'>
                <div className='flex justify-between items-center'>
                          <div className='flex items-center gap-4'>
                            <div className='bg-white p-2 rounded-lg shadow-sm'>
                              <img src={flight.airlineLogo || "/airplane.png"} alt={flight.data.flightName} className='h-12 w-auto object-contain' />
                            </div>
                            <div>
                              <h3 className='text-lg font-bold text-gray-900'>{flight.data.flightName}</h3>
                              <p className='text-sm text-gray-600'>Flight {flight.data.flightNumber}</p>
                            </div>
                          </div>
                          <div className='text-right'>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              status === 'completed' ? 'bg-gray-100 text-gray-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {status === 'cancelled' ? '❌ Cancelled' :
                               status === 'completed' ? '✅ Completed' :
                               '🎫 Confirmed'}
                            </span>
                            {status === 'upcoming' && (
                              <p className='text-sm text-gray-600 mt-1 font-medium'>{daysUntil}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Flight Details */}
                      <div className='p-6'>
                        <div className='grid grid-cols-7 gap-4 items-center'>
                          {/* Departure */}
                          <div className='col-span-2 text-center'>
                            <p className='text-xs text-gray-500 uppercase tracking-wider mb-1'>Departure</p>
                            <p className='text-3xl font-bold text-gray-900'>{flight.data.originAirport}</p>
                            <p className='text-lg font-medium text-gray-700 mt-1'>{formatTime(depTime)}</p>
                            <p className='text-sm text-gray-600'>{formatDate(depDate)}</p>
                          </div>

                          {/* Flight Path */}
                          <div className='col-span-3 px-4'>
                            <div className='text-center mb-3'>
                              <span className='inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium'>
                                {calculateDuration(flight.data.departureTime, flight.data.arrivalTime)}
                              </span>
                            </div>
                            <div className='relative'>
                              <div className='h-[2px] bg-gradient-to-r from-purple-400 to-blue-400 w-full'></div>
                              <div className='absolute left-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-purple-600 rounded-full border-2 border-white'></div>
                              <div className='absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-blue-600 rounded-full border-2 border-white'></div>
                              <div className='absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                                <div className='bg-white p-2 rounded-full shadow-lg'>
                                  <img src="/airplane.png" className='w-6 h-6' alt="Flight" />
                                </div>
                              </div>
                            </div>
                            <div className='text-center mt-2'>
                              <span className='text-xs text-gray-500'>Non-stop</span>
                            </div>
                  </div>

                          {/* Arrival */}
                          <div className='col-span-2 text-center'>
                            <p className='text-xs text-gray-500 uppercase tracking-wider mb-1'>Arrival</p>
                            <p className='text-3xl font-bold text-gray-900'>{flight.data.destinationAirport}</p>
                            <p className='text-lg font-medium text-gray-700 mt-1'>{formatTime(arrTime)}</p>
                            <p className='text-sm text-gray-600'>{formatDate(arrDate)}</p>
                </div>
                  </div>

                        {/* Booking Details */}
                        <div className='mt-6 pt-6 border-t border-gray-200'>
                          <div className='flex flex-wrap gap-4 justify-between items-center'>
                            <div className='flex items-center gap-3'>
                              <div className='flex items-center gap-2 text-gray-600'>
                                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'></path>
                                </svg>
                                <span className='font-medium'>{flight.data.passengers} {flight.data.passengers > 1 ? 'Passengers' : 'Passenger'}</span>
                  </div>
                              <span className='text-gray-400'>•</span>
                              <div className='flex items-center gap-2 text-gray-600'>
                                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z'></path>
                                </svg>
                                <span className='font-medium'>{flight.data.seat} Class</span>
                  </div>
                </div>

                            {/* Action Buttons */}
                            <div className='flex gap-3'>
                              <Link to='/eticket_' state={{
                                email: flight.email, 
                                time: flight.time, 
                                flightNumber: flight.data.flightNumber, 
                                departureTime: flight.data.departureTime
                              }}>
                                <button className='px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg'>
                                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z'></path>
                                  </svg>
                                  View E-Ticket
                  </button>
                  </Link>
                              
                              {status === 'upcoming' && (
                                <Link to='/cancel' state={{
                                  email: flight.email, 
                                  time: flight.time, 
                                  flightNumber: flight.data.flightNumber, 
                                  departureTime: flight.data.departureTime
                                }}>
                                  <button className='px-5 py-2.5 bg-white text-red-600 border-2 border-red-600 rounded-lg font-medium hover:bg-red-50 transition-all duration-200 flex items-center gap-2'>
                                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'></path>
                                    </svg>
                    Cancel
                  </button>
                  </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default MyFlights;
