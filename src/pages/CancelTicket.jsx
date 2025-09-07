import React, { useEffect, useRef, useState } from 'react'
import NavbarM from '../components/NavbarM'
import { useLocation } from 'react-router-dom'
import Footer from '../components/Footer'

const CancelTicket = ({user}) => {
  const location = useLocation();
  const [booking, setBooking] = useState([]);
  const data = location.state || {}
  const ticketref = useRef(); 
  // console.log(data);

  useEffect(() => {
    const fetchFlights = async () => {
        const response = await fetch('https://airline-management-and-booking-syst.vercel.app/api/bookings');
        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }
        const bookingData = await response.json();
        const filteredBooking = bookingData.filter(book =>
          book.email === data.email && book.data.flightNumber === data.flightNumber && book.data.departureTime === data.departureTime && book.time === data.time
        );
        
        if (filteredBooking.length > 0) {
          // Check if flight is in the past
          const departureDate = new Date(filteredBooking[0].data.departureTime);
          const currentDate = new Date();
          
          if (departureDate < currentDate) {
            alert('Cannot cancel past flights');
            window.history.back();
            return;
          }
          
        setBooking(filteredBooking[0]);
        }
      };
      
      fetchFlights();

      const intervalId = setInterval(fetchFlights, 1000);
      return () => clearInterval(intervalId);
    }, [data]);



  const timeDifference = (startTime, endTime) => {
    // Parse the input timestamps
    const start = new Date(startTime);
    const end = new Date(endTime);

    // Calculate the difference in milliseconds
    const diffMs = end - start;
    // console.log("diff"+diffMs);

    // Calculate the difference in hours and minutes
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    // Format the result
    let result = "";
    if(diffMinutes !== 0)
    result = `${diffHours.toString().padStart(2, '0')}h ${diffMinutes.toString().padStart(2, '0')}m`;
    else
    result = `${diffHours.toString().padStart(2, '0')}h`;
    return result;
}

  const formatDateTime = (dateTimeString) => {
    if (typeof dateTimeString !== 'string')
    return "Invalid Date";
    const [datePart, timePart] = dateTimeString.split('T');
    // const [year, month, day] = datePart.split('-');
    // const [hours, minutes] = timePart.split(':');
    // const formattedDate = `${day}-${month}-${year}`;
    // const formattedTime = `${hours}:${minutes}`;
    return [datePart, timePart];
  };

  const formatDate = (date) => {
    if (typeof date !== 'string')
    return "Invalid Date";
    const [year, month, day] = date.split('-');
    // const [hours, minutes] = timePart.split(':');
    const formattedDate = `${day}-${month}-${year}`;
    // const formattedTime = `${hours}:${minutes}`;
    return formattedDate;
  };

  
    const handleCancel = async () => {
        const cancelData = {
            flightNumber: booking.data.flightNumber,
            departureTime: booking.data.departureTime,
            arrivalTime: booking.data.arrivalTime,
            passengers: booking.data.passengers,
            seat: booking.data.seat.toLowerCase(),
        };
        const updatedFormData = booking.formData.map(entry => {
            entry.status = 0;
            return entry;
        }); 
        // console.log(updatedFormData);
        const cancelPass = {
            email: booking.email,
            flightNumber: booking.data.flightNumber,
            departureTime: booking.data.departureTime,
            time: booking.time,
            formData: updatedFormData
        }
        let response = await fetch("https://airline-management-and-booking-syst.vercel.app/api/cancelall", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(cancelData),
        });
        let response_ = await fetch("https://airline-management-and-booking-syst.vercel.app/api/booking", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(cancelPass),
        });
        if (response.ok) 
        {
            alert('Flight Ticket has been cancelled.');
            const result = await response.json();
            // console.log('Cancelled successfully:', result);
        } 
        else
        console.error('Failed to cancelled:', response.statusText);
        if (response_.ok) 
        {
            alert('Booking has been cancelled.');
            const result = await response_.json();
            // console.log('Cancelled successfully:', result);
        } 
        else
        console.error('Failed to cancelled:', response_.statusText);
    };
    const allStatusesAreOne = booking.formData && booking.formData.every(entry => entry.status === 1);

    const handleIndividualCancel = async (index) => {
      const cancelData = {
        flightNumber: booking.data.flightNumber,
        departureTime: booking.data.departureTime,
        arrivalTime: booking.data.arrivalTime,
        passengers: 1,
        seat: booking.data.seat.toLowerCase(),
      };
      let response = await fetch("https://airline-management-and-booking-syst.vercel.app/api/cancelall", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cancelData),
      });
      if (response.ok) 
        {
            alert('Flight Ticket has been cancelled.');
            const result = await response.json();
            // console.log('Cancelled successfully:', result);
        } 
        else
        console.error('Failed to cancelled:', response.statusText);
      const cancelPass = {
        email: booking.email,
        flightNumber: booking.data.flightNumber,
        departureTime: booking.data.departureTime,
        time: booking.time,
        passengerIndex: index,
      };
      const response_ = await fetch("https://airline-management-and-booking-syst.vercel.app/api/cancelOne", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cancelPass),
      });
      if (response_.ok) {
        const result = await response.json();
        alert('Flight Ticket has been cancelled.');
        setBooking(result.booking);
      } else {
        console.error('Failed to cancel:', response_.statusText);
      }
    };

  return (
    <>
    <NavbarM user={user}/>
    <div className='min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50'>
      <div className='container mx-auto px-4 py-8'>
        <h1 className='text-4xl font-bold text-gray-900 text-center mb-8'>Cancel Booking</h1>
        
        {booking.formData ? (
          <>
            <div className='max-w-5xl mx-auto'>
              {booking.formData.map((list, index) => (
                <div key={index} className='mb-6'>
                  <div className='bg-white rounded-2xl shadow-lg overflow-hidden'>
                    <div className='flex flex-col lg:flex-row'>
                      {/* Ticket Details */}
                      <div className='flex-1 p-6 lg:p-8'>
                        {/* Flight Header */}
                        <div className='flex items-center justify-between mb-6'>
                          <div className='flex items-center gap-4'>
                            <img className='h-12 w-12' src="/airplane.png" alt="Flight" />
      <div>
                              <h3 className='text-xl font-bold text-gray-900'>{booking.data.flightName}</h3>
                              <p className='text-sm text-gray-600'>Flight {booking.data.flightNumber} • {booking.data.seat} Class</p>
                            </div>
                </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            list.status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {list.status === 1 ? '✅ Active' : '❌ Cancelled'}
                          </span>
                  </div>
                        
                        {/* Route */}
                        <div className='grid grid-cols-3 gap-4 mb-6'>
                          <div className='text-center'>
                            <p className='text-sm text-gray-500 mb-1'>From</p>
                            <p className='text-2xl font-bold text-gray-900'>{booking.data.originAirport}</p>
                  </div>
                          <div className='flex items-center justify-center'>
                            <div className='relative w-full'>
                              <div className='h-[2px] bg-gradient-to-r from-purple-400 to-blue-400 w-full'></div>
                              <div className='absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2'>
                                <span className='text-sm text-gray-500'>{timeDifference(booking.data.departureTime, booking.data.arrivalTime)}</span>
                  </div>
                </div>
                  </div>
                          <div className='text-center'>
                            <p className='text-sm text-gray-500 mb-1'>To</p>
                            <p className='text-2xl font-bold text-gray-900'>{booking.data.destinationAirport}</p>
                  </div>
                </div>
                        
                        {/* Passenger Info */}
                        <div className='bg-gray-50 rounded-lg p-4 mb-6'>
                          <p className='text-sm text-gray-500 mb-1'>Passenger</p>
                          <p className='text-lg font-bold text-gray-900'>{list.title}. {list.firstName} {list.lastName}</p>
                  </div>
                        
                        {/* Time Details */}
                        <div className='grid grid-cols-2 gap-4'>
                          <div>
                            <p className='text-sm text-gray-500 mb-1'>Departure</p>
                            <p className='font-bold text-gray-900'>{formatDate(formatDateTime(booking.data.departureTime)[0])}</p>
                            <p className='text-lg font-medium text-gray-700'>{formatDateTime(booking.data.departureTime)[1]}</p>
                  </div>
                          <div>
                            <p className='text-sm text-gray-500 mb-1'>Arrival</p>
                            <p className='font-bold text-gray-900'>{formatDate(formatDateTime(booking.data.arrivalTime)[0])}</p>
                            <p className='text-lg font-medium text-gray-700'>{formatDateTime(booking.data.arrivalTime)[1]}</p>
                  </div>
                </div>
              </div>
                      
                      {/* Cancel Action */}
                      <div className='bg-gradient-to-br from-purple-50 to-blue-50 p-6 lg:p-8 flex items-center justify-center lg:w-72'>
                        {list.status === 1 ? (
                          <button 
                            onClick={() => handleIndividualCancel(index)} 
                            className='bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2 shadow-lg'
                          >
                            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12'></path>
                            </svg>
                            Cancel Ticket
                          </button>
                        ) : (
                          <div className='text-center'>
                            <img src="/cancelled.png" alt="Cancelled" className='w-20 h-20 mx-auto mb-2 opacity-50' />
                            <p className='text-xl font-bold text-red-500'>Cancelled</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Cancel All Button */}
              {allStatusesAreOne && booking.formData.length > 1 && (
                <div className='flex justify-center mt-8'>
                  <button 
                    onClick={handleCancel} 
                    className='bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-lg transition-colors flex items-center gap-2 shadow-lg'
                  >
                    <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12'></path>
                    </svg>
                    Cancel All Tickets
                  </button>
                </div>
                )}
            </div>
          </>
        ) : (
          <div className='flex justify-center items-center h-64'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600'></div>
          </div>
        )}
      </div>
            </div>
    <Footer/>
    </>
  )
}

export default CancelTicket;
