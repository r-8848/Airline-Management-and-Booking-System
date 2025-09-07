import React, { useState } from 'react'
import NavbarM from '../components/NavbarM';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../components/Footer';

const Preview = ({user}) => {
    const location = useLocation();
    const data = location.state || {};
    data.user = user;
    // console.log(data);
    const totalcost = (data.data.price*data.data.passengers);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleClick = async () => {
        setLoading(true); // Set loading state to true when proceed is clicked
        sessionStorage.removeItem('bookingSent');
        
        try {
            // First check if seats are still available
            const availabilityCheck = await fetch("https://airline-management-and-booking-syst.vercel.app/api/check-availability", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    flightNumber: data.data.flightNumber,
                    departureTime: data.data.departureTime,
                    passengers: data.data.passengers,
                    seat: data.data.seat
                })
            });
            
            const availability = await availabilityCheck.json();
            
            if (!availability.success || !availability.available) {
                alert(availability.message || 'Seats are no longer available');
                setLoading(false);
                navigate(-1); // Go back to passenger form
                return;
            }
            
            // Proceed with payment if seats are available
            let response = await axios.post("https://airline-management-and-booking-syst.vercel.app/api/payments", data);
            if (response && response.status === 200) {
                // console.log(response.data);
                if (response.data.url) {
                window.location.href = response.data.url;
                } else {
                    throw new Error('No payment URL received from server');
                }
            }
        } catch (error) {
            console.error('Error during payment processing:', error);
            
            // More detailed error handling
            let errorMessage = 'An error occurred. Please try again.';
            
            if (error.response) {
                // Server responded with error
                if (error.response.data && error.response.data.message) {
                    errorMessage = error.response.data.message;
                } else if (error.response.status === 500) {
                    errorMessage = 'Server error. Please check if Stripe is configured properly.';
                } else if (error.response.status === 404) {
                    errorMessage = 'Payment endpoint not found.';
                }
            } else if (error.request) {
                // Request made but no response
                errorMessage = 'Cannot connect to server. Please check if backend is running.';
            } else {
                // Something else happened
                errorMessage = error.message || 'An unexpected error occurred.';
            }
            
            alert(errorMessage);
            setLoading(false); // Reset loading state if an error occurs
        }
    }

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
        <NavbarM user={user}/>
        <div className='bg-[#F7F6FF]'>
            <h2 className='text-center text-4xl font-medium pt-2'>Preview</h2>
            <div className="bg-white w-[90%] md:w-3/4 h-auto md:h-44 m-auto rounded-3xl px-8 py-4 pl-10 mt-5 drop-shadow-[0_0_5px_rgba(0,0,0,0.1)]">
                <div className="flex flex-col md:flex-row justify-between">
                    <div className="hidden md:inline text-2xl md:text-3xl font-medium text-center md:text-left">{data.data.originAirport}</div>
                    <div className="text-center md:text-left">
                    <div className="text-lg md:text-xl font-medium">{data.data.flightName}</div>
                    <div className="text-lg md:text-xl font-medium">{data.data.flightNumber}</div>
                    </div>
                    <div className="hidden md:inline text-2xl md:text-3xl font-medium text-center md:text-right">{data.data.destinationAirport}</div>
                </div>
                <div className="relative flex flex-col md:flex-row justify-between items-center mt-4 md:mt-0">
                    <div className="text-center md:text-left">
                    <div className="font-normal">Departure</div>
                    <div className="text-2xl md:text-3xl font-medium">{formatDateTime(data.data.departureTime)[1]}</div>
                    <div className="font-normal">{formatDate(formatDateTime(data.data.departureTime)[0])}</div>
                    </div>
                    <div className="flex items-center justify-center w-full md:w-[78%] mt-4 md:mt-0">
                    <span className="hidden md:inline bg-[#00c800] h-4 w-4 rounded-lg"></span>
                    <span className="hidden md:inline bg-[#00c800] h-0.5 flex-grow mx-2"></span>
                    <span className="inline md:hidden text-2xl md:text-3xl font-medium text-center md:text-right pr-6">{data.data.originAirport}</span>
                    <img src="/airplane.png" className="h-8 md:h-10" />
                    <span className="inline md:hidden text-2xl md:text-3xl font-medium text-center md:text-right pl-6">{data.data.destinationAirport}</span>
                    <span className="hidden md:inline bg-[#00c800] h-0.5 flex-grow mx-2"></span>
                    <span className="hidden md:inline bg-[#00c800] h-4 w-4 rounded-lg"></span>
                    </div>
                    <div className="text-center md:text-right mt-4 md:mt-0">
                    <div className="font-normal">Arrival</div>
                    <div className="text-2xl md:text-3xl font-medium">{formatDateTime(data.data.arrivalTime)[1]}</div>
                    <div className="font-normal">{formatDate(formatDateTime(data.data.arrivalTime)[0])}</div>
                    </div>
                </div>
            </div>
            <div className="w-[90%] md:w-3/4 bg-white mx-auto mt-4 py-4 px-4 md:px-8 text-lg md:text-xl font-medium rounded-3xl flex-col drop-shadow-[0_0_5px_rgba(0,0,0,0.1)]">
                <div className='bg-white w-full md:w-4/5 pb-2 text-center md:text-left'>
                    Passengers List:
                </div>
                <div className='font-normal max-h-40 md:max-h-60 overflow-auto'>
                    <table className="w-full bg-white border-collapse table-auto">
                        <thead className="sticky top-0 bg-gray-200 text-sm md:text-base text-gray-700">
                            <tr>
                                <th className="border-2 border-gray-300 px-2 md:px-4 py-2">#</th>
                                <th className="border-2 border-gray-300 px-2 md:px-4 py-2">Title</th>
                                <th className="border-2 border-gray-300 px-2 md:px-4 py-2">Name</th>
                                <th className="border-2 border-gray-300 px-2 md:px-4 py-2">Gender</th>
                                <th className="border-2 border-gray-300 px-2 md:px-4 py-2">Date of Birth</th>
                                <th className="border-2 border-gray-300 px-2 md:px-4 py-2">Mobile Number</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.formData.map((list, index) => (
                                <tr key={index} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                                    <td className="border-2 border-gray-300 px-2 md:px-4 py-2 text-center">{index + 1}</td>
                                    <td className="border-2 border-gray-300 px-2 md:px-4 py-2 text-center">{list.title}</td>
                                    <td className="border-2 border-gray-300 px-2 md:px-4 py-2 text-center">{list.firstName} {list.lastName}</td>
                                    <td className="border-2 border-gray-300 px-2 md:px-4 py-2 text-center">{list.gender}</td>
                                    <td className="border-2 border-gray-300 px-2 md:px-4 py-2 text-center">{formatDate(list.dob)}</td>
                                    <td className="border-2 border-gray-300 px-2 md:px-4 py-2 text-center">{list.mobile}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="w-[95%] sm:w-[90%] md:w-3/4 h-auto bg-white mx-auto mt-4 rounded-3xl flex flex-col drop-shadow-[0_0_5px_rgba(0,0,0,0.1)]">
                <div className='bg-white flex flex-col md:flex-row rounded-3xl justify-around items-center p-4 md:p-6'>
                    <div className='bg-white text-xl sm:text-2xl font-medium mt-3 sm:mt-5'>
                        Total Passenger(s): {data.data.passengers}
                    </div>
                    <div className='bg-white text-xl sm:text-2xl font-medium mt-3 sm:mt-5'>
                        Cost per {data.data.seat} Seat: INR {data.data.price}
                    </div>
                </div>
                <div className='bg-white font-bold text-xl sm:text-2xl mt-3 sm:mt-5 flex justify-center items-center'>
                    Total Cost: INR {totalcost}
                </div>
                <div className='w-[90%] sm:w-[85%] h-px bg-[#b9b9b9] mt-2.5 mx-auto'>
                </div>
                <div className='flex flex-col md:flex-row justify-around items-center bg-white mt-4 space-y-3 md:space-y-0 md:space-x-4 p-4 md:p-6'>
                    <button className='bg-[#8b1c64] h-12 w-24 text-white text-xl rounded-xl font-bold disabled:cursor-not-allowed disabled:opacity-50' disabled={loading} onClick={() => {navigate(-1)}}>
                        Back
                    </button>
                    <button onClick={handleClick} className='bg-[#8b1c64] h-12 w-36 text-white text-xl rounded-xl font-bold flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-50' disabled={loading}>
                        {loading ? <img src="/load.gif" alt="Loading..." className="h-8 w-8 mr-2"/> : null}
                        Proceed
                    </button>
                </div>
            </div>
        </div>
        {/* <Footer/> */}
        </>
    )
}

export default Preview;
