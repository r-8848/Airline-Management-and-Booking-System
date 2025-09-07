import React, { useEffect, useRef, useState } from 'react'
import NavbarM from '../components/NavbarM'
import { useLocation, useNavigate } from 'react-router-dom'
import { useReactToPrint } from 'react-to-print'
import Footer from '../components/Footer'

const Eticket = ({user}) => {
  const location = useLocation();
  const ticketref = useRef(); 
  const query = new URLSearchParams(location.search);
  const info = query.get('info');
  const data = info ? JSON.parse(decodeURIComponent(info)) : {};
  // console.log(data);
  // const [bookingFlag, setBookingFlag] = useState(false);
  const handlePrint = useReactToPrint({
    content: () => ticketref.current,
    documentTitle: "E-Tickets",
    // onAfterPrint: () => alert("Print Success"),
  })
  const now = new Date();
  const formattedTime = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}T${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
  const Data = {
    email: data.user.email,
    status: 1,
    data: data.data,
    formData: data.formData,
    time: formattedTime
  }
  const Data_ = {
    flightNumber: data.data.flightNumber,
    departureTime: data.data.departureTime,
    arrivalTime: data.data.arrivalTime,
    passengers: data.data.passengers,
    seat: data.data.seat.toLowerCase()
  }
  // console.log(Data);
  // console.log(Data.data);
  // console.log(Data_);
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionStorage.getItem('bookingSent')) {
    sessionStorage.setItem('bookingSent', true);
    const Booking = async () => {
      // Use the new improved booking endpoint with validation
      let response = await fetch("http://localhost:3000/api/booking-with-validation", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(Data)
      });
      
      if (response.ok) {
          const result = await response.json();
        console.log('Booking confirmed:', result.message);
        if (result.remainingSeats) {
          console.log('Remaining seats:', result.remainingSeats);
      } 
      } else {
        const error = await response.json();
        console.error('Failed to submit booking:', error.message);
        // Show error to user
        alert(`Booking failed: ${error.message}`);
        // Redirect back to flight selection
        navigate('/');
      }
    }
    
    // Remove the separate Update call since it's now handled in the transaction
    Booking();
    }
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
  
  return (
    <>
    <NavbarM user={data.user} />
      <h1 className="text-center font-bold text-2xl md:text-4xl pt-10 bg-slate-100">E-Tickets</h1>
      <div ref={ticketref} className="bg-slate-100">
        {data.formData.map((list, index) => (
          <div key={index} className="flex flex-col justify-center items-center">
            <div className="h-auto md:h-[65vh] w-[90vw] md:w-[80vw] bg-white rounded-[20px] overflow-hidden shadow-lg mx-2 md:mx-6 my-6 flex flex-col md:flex-row relative">
              <div className="w-full md:w-[70%] h-auto md:h-[65vh] rounded-l-[20px] p-4 md:pl-12 md:pr-20 md:pb-10 z-10 bg-white/70">
                <div className="h-auto md:h-[10vh] w-full px-2 md:px-5 flex items-center justify-between md:justify-evenly">
                  <img className="mt-4 object-fill h-12 md:h-16" src="/eplane.png" alt="Plane"/>
                  <p className="text-xl font-bold md:text-2xl text-gray-500 mt-4">{data.data.seat} Class</p>
                </div>
                <div className="bg-gray-400 h-[1px] mt-3 mb-4"></div>
                <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-20 mb-2 mt-4">
                  <div className="flex flex-col justify-center items-center">
                    <div className="font-normal text-xs md:text-lg text-gray-500">AIRLINE</div>
                    <div className="font-bold text-lg md:text-2xl">{data.data.flightName}</div>
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <div className="font-normal text-xs md:text-lg text-gray-500">FROM</div>
                    <div className="font-bold text-lg md:text-2xl">{data.data.originAirport}</div>
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <div className="font-normal text-xs md:text-lg text-gray-500">TO</div>
                    <div className="font-bold text-lg md:text-2xl">{data.data.destinationAirport}</div>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row justify-between mb-2 mt-6 gap-4 md:gap-0">
                  <div className="flex flex-col justify-center items-center w-full md:w-72">
                    <div className="font-normal text-xs md:text-lg text-gray-500 text-center">PASSENGER</div>
                    <div className="font-bold text-sm md:text-2xl text-center">{list.title}. {list.firstName} {list.lastName}</div>
                  </div>
                  <div className="flex flex-col justify-center items-center w-full md:w-32">
                    <div className="font-normal text-xs md:text-lg text-gray-500 text-center">FLIGHT TIME</div>
                    <div className="font-bold text-sm md:text-2xl text-center">{timeDifference(data.data.departureTime, data.data.arrivalTime)}</div>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row justify-between mt-6 gap-4 md:gap-0">
                  <div className="flex flex-col justify-center items-center">
                    <div className="font-normal text-xs md:text-lg text-gray-500">DEPARTURE</div>
                    <div className="font-bold text-lg md:text-xl text-black">{formatDate(formatDateTime(data.data.departureTime)[0])}</div>
                    <div className="font-semibold text-sm md:text-3xl">{formatDateTime(data.data.departureTime)[1]}</div>
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <div className="font-normal text-xs md:text-lg text-gray-500">ARRIVAL</div>
                    <div className="font-bold text-lg md:text-xl text-black">{formatDate(formatDateTime(data.data.arrivalTime)[0])}</div>
                    <div className="font-semibold text-sm md:text-3xl">{formatDateTime(data.data.arrivalTime)[1]}</div>
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <div className="font-normal text-xs md:text-lg text-gray-500">FLIGHT NO</div>
                    <div className="font-bold text-lg md:text-2xl">{data.data.flightNumber}</div>
                  </div>
                </div>
              </div>
              <div className="hidden md:block w-full md:w-[30%] h-[65vh] bg-black relative overflow-hidden rounded-r-[20px]">
                <img className="object-fill h-full" src="https://as2.ftcdn.net/v2/jpg/04/34/85/91/1000_F_434859188_XrsJIIRfMovZDOulIlfX867As5m4niLB.jpg" alt="Background"/>
              </div>
              <div className="block md:hidden absolute inset-0 h-full w-full" style={{ 
                backgroundImage: `url("https://as2.ftcdn.net/v2/jpg/04/34/85/91/1000_F_434859188_XrsJIIRfMovZDOulIlfX867As5m4niLB.jpg")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                zIndex: 1,
                opacity: 1
              }}></div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center items-center bg-slate-100 pb-6">
        <button onClick={handlePrint} className="text-white text-lg md:text-xl font-bold py-2 px-4 rounded-xl bg-green-500 hover:bg-green-700">
          <div className="elements flex justify-center items-center gap-2">
            <img src="/print.png" alt="Print Icon" className="h-6 md:h-10" />
            <div>Print</div>
          </div>
        </button>
      </div>
      <div className="flex justify-center items-center gap-4 bg-slate-100 pb-10">
        <button 
          onClick={() => navigate('/')} 
          className="text-white text-lg font-bold py-2 px-6 rounded-xl bg-blue-500 hover:bg-blue-700 transition-colors"
        >
          Book Another Flight
        </button>
        <button 
          onClick={() => navigate('/myflts', { state: { email: data.user.email } })} 
          className="text-white text-lg font-bold py-2 px-6 rounded-xl bg-purple-600 hover:bg-purple-700 transition-colors"
        >
          View My Bookings
        </button>
      </div>
      <Footer/>
    </>
  )
}

export default Eticket
