import React, { useEffect, useRef, useState } from 'react'
import NavbarM from '../components/NavbarM'
import { useLocation } from 'react-router-dom'
import { useReactToPrint } from 'react-to-print'
import Footer from '../components/Footer'

const Eticket_ = ({user}) => {
  const location = useLocation();
  const data = location.state || {};
  const [booking, setBooking] = useState([]);
  const ticketref = useRef(); 
  const handlePrint = useReactToPrint({
    content: () => ticketref.current,
    documentTitle: "E-Tickets",
    // onAfterPrint: () => alert("Print Success"),
  })

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
        
        setBooking(filteredBooking[0]);
        // console.log(filteredBooking[0]);
      };
      
      fetchFlights();
    }, []);
  
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

  const hasValidStatus = booking.formData && booking.formData.some(list => list.status === 1);

  return (
    <>
    <NavbarM user={user}/>
      <h1 className='text-center font-bold text-4xl mt-10'>E-Tickets</h1>
      <div ref={ticketref}>
        {booking.formData && booking.formData.filter(list => list.status === 1).map((list, index) => (
          <div key={index} className='flex flex-col justify-center items-center'>
            <div className="h-auto md:h-[65vh] w-[90vw] md:w-[80vw] bg-white rounded-[20px] overflow-hidden shadow-lg mx-2 md:mx-6 my-6 flex flex-col md:flex-row">
              <div className="w-full md:w-[70%] h-auto md:h-[65vh] rounded-l-[20px] p-4 md:pl-12 md:pr-20 md:pb-10">
                <div className="h-auto md:h-[10vh] w-full px-2 md:px-5 flex items-center justify-between md:justify-evenly">
                  <img className="mt-4 object-fill h-12 md:h-16" src="/eplane.png" />
                  <p className="text-lg md:text-[30px] text-gray-500 mt-4">{booking.data.seat} Class</p>
                </div>
                <div className='bg-gray-400 h-[1px] mt-3 mb-4'></div>
                <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-40 mb-2 mt-4">
                  <div className="flex flex-col justify-center items-center">
                  {(!booking.status || !list.status) ? (
                    <img src="/cancelled.png" alt="" className='absolute left-28 top-60 w-[60%]' />
                  ):(<div></div>)}
                    <div className="font-normal text-sm md:text-lg text-gray-500">AIRLINE</div>
                    <div className="font-bold text-lg md:text-2xl">{booking.data.flightName}</div>
                  </div>
                  <div className='flex flex-col justify-center items-center'>
                    <div className="font-normal text-sm md:text-lg text-gray-500">FROM</div>
                    <div className="font-bold text-2xl">{booking.data.originAirport}</div>
                  </div>
                  <div className='flex flex-col justify-center items-center'>
                    <div className="font-normal text-sm md:text-lg text-gray-500">TO</div>
                    <div className="font-bold text-lg md:text-2xl">{booking.data.destinationAirport}</div>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row justify-between mb-2 mt-6 gap-4 md:gap-0">
                  <div className="flex flex-col justify-center items-center w-full md:w-72">
                    <div className="font-normal text-sm md:text-lg text-gray-500 text-center">PASSENGER</div>
                    <div className="font-bold text-lg md:text-2xl text-center">{list.title}. {list.firstName} {list.lastName}</div>
                  </div>
                  <div className="flex flex-col justify-center items-center w-full md:w-32">
                    <div className="font-normal text-sm md:text-lg text-gray-500 text-center">FLIGHT TIME</div>
                    <div className="font-bold text-lg md:text-2xl text-center">{timeDifference(booking.data.departureTime, booking.data.arrivalTime)}</div>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row justify-between mt-6 gap-4 md:gap-0">
                  <div className="flex flex-col justify-center items-center">
                    <div className="font-normal text-sm md:text-lg text-gray-500">DEPARTURE</div>
                    <div className="font-bold text-lg md:text-xl text-black">{formatDate(formatDateTime(booking.data.departureTime)[0])}</div>
                    <div className="font-semibold text-xl md:text-3xl">{formatDateTime(booking.data.departureTime)[1]}</div>
                  </div>
                  <div className='flex flex-col justify-center items-center'>
                    <div className="font-normal text-sm md:text-lg text-gray-500">ARRIVAL</div>
                    <div className="font-bold text-lg md:text-xl text-black">{formatDate(formatDateTime(booking.data.arrivalTime)[0])}</div>
                    <div className="font-semibold text-xl md:text-3xl">{formatDateTime(booking.data.arrivalTime)[1]}</div>
                  </div>
                  <div className='flex flex-col justify-center items-center'>
                    <div className="font-normal text-sm md:text-lg text-gray-500">FLIGHT NO</div>
                    <div className="font-bold text-lg md:text-2xl">{booking.data.flightNumber}</div>
                  </div>
                </div>
              </div>
              <div className='w-[30%] h-[65vh] bg-black relative overflow-hidden rounded-r-[20px]'>
                <img className="object-fill h-[65vh]" src="https://as2.ftcdn.net/v2/jpg/04/34/85/91/1000_F_434859188_XrsJIIRfMovZDOulIlfX867As5m4niLB.jpg" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className='flex justify-center items-center'>
        {hasValidStatus ? (
          <button onClick={handlePrint} className='text-white text-xl font-bold py-2 px-4 rounded-xl bg-green-500 hover:bg-green-700'>
            <div className="elements flex justify-center items-center gap-2">
              <img src="/print.png" alt="" className='h-10' />
              <div>Print</div>
            </div>
          </button>
        ):(
          <div>No Confirmed Tickets Available.</div>
        )}
      </div>
      {/* <Footer/> */}
    </>
  )
}

export default Eticket_
