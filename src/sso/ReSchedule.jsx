import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AdminMenu from "../components/AdminMenu";
import AdminNav from "../components/AdminNav";

function ReSchedule() {

  const [departureTime,setDepartureTime]=useState("");
  const [arrivalTime,setArrivalTime]=useState("");
  const [duration,setDuration]=useState("");
  const [errorMessage, setErrorMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const location = useLocation();
  const data = location.state || {};
  console.log(data);

  const navigate = useNavigate();

  function timeDifference(startTime, endTime) {
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
    const result = `${diffHours.toString().padStart(2, '0')}h ${diffMinutes.toString().padStart(2, '0')}m`;

    return result;
}

useEffect(() => {
  if (arrivalTime && departureTime >= arrivalTime) {
    setErrorMessage("Arrival time cannot precede departure time");
  } else {
    setErrorMessage("");
  }
}, [departureTime, arrivalTime]);


  const handleDeparture=(e)=>{
      console.log(e.target.value)
      setDepartureTime(e.target.value);
      // console.log("departure "+departureTime)
      if(departureTime && arrivalTime)
      {
        setDuration(timeDifference(departureTime, arrivalTime));
        // console.log("duration1 "+duration)
      }
      
  }
  const handleArrival=(e)=>{
    setArrivalTime(e.target.value);
    // console.log("arrival "+arrivalTime)
    if(departureTime && arrivalTime)
    {
      setDuration(timeDifference(departureTime, arrivalTime));
      // console.log("duration2 "+duration)
    }
    
  }
  useEffect(() => {

    if(departureTime && arrivalTime)
      {
        setDuration(timeDifference(departureTime, arrivalTime));
        // console.log("durationNew "+duration)
      }
    
  }, [departureTime,arrivalTime,duration]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const flightdata = {
      flightName: data.flightName,
      flightNumber: data.flightNumber,
      departureTime: data.departureTime,
      arrivalTime: data.arrivalTime,
      newdepTime: departureTime,
      newarrTime: arrivalTime
    }
    console.log(flightdata);
    const response = await fetch('https://airline-management-and-booking-syst.vercel.app/api/re-edit-flightin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(flightdata),
    });

    if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
    }
    navigate('/admin/scheduled');
}; 

  return (
    <div className="grid grid-cols-12 min-h-screen min-w-screen">
{/*       <div className="min-h-screen col-span-3 flex flex-col items-center">
        <AdminMenu />
      </div> */}
      {/* Toggle Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 bg-slate-700 text-white px-4 py-2 rounded shadow-lg"
      >
        {/* {isOpen ? 'Close' : 'Menu'} */}
        <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars'} text-xl`}></i>
      </button>
      {/* Sliding Menu - Overlays screen, doesn't shift layout */}
      <div
        className={`fixed top-0 left-0 h-full shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <AdminMenu />
      </div>
      {/* Backdrop when menu is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-30"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
      <div className=" min-h-screen col-span-full p-10 z-10 relative">
        <AdminNav />
        <div className="w-full h-[58rem] bg-white relative rounded-xl shadow-lg p-6 pt-8 mb-2 mt-8">
          <div className="text-3xl font-semibold text-slate-600">
            RE-SCHEDULE FLIGHT
          </div>
          <form
            action="/FlightsManagement"
            method="post"
            className="mt-12 relative"
          >
            <div className="bg-slate-100 p-4 flex items-center">
              <label for="airlines" className="text-xl font-medium">
                Selected Airline
              </label>
              <input name="airlines" id="airlines" value={data.flightName} disabled className="absolute left-1/2 border border-slate-500 h-10 p-2"/>
            </div>
            <div className="p-3 flex items-center">
              <label for="flightNo" className="text-xl font-medium">
                Selected Flight Number
              </label>
              <input name="flightNo" id="flightNo" value={data.flightNumber} disabled className="border border-slate-500 absolute left-1/2 h-10 p-2"/>
            </div>
            <div className="bg-slate-100 p-3 flex items-center">
              <label for="source" className="text-xl font-medium">
                Source - Destination
              </label>
              <div className="relative left-[28.85%] flex gap-2 justify-center items-center">
                <input name="airlines" id="source" disabled value={data.originAirport} className="border border-slate-500 h-10 w-20 p-2"/>
                <img src="/flight.png" className="h-5 w-5" alt="" />
                <input name="airlines" id="source" disabled value={data.destinationAirport} className="border border-slate-500 h-10 w-20 p-2"/>
              </div>
            </div>
            <div className=" p-3">
              <label for="departure-time" className="text-xl font-medium">
                Original Departure Date And Time Of Flight
              </label>
              <input
                type="datetime-local"
                id="departure-time"
                name="departure-time"
                disabled
                value={data.departureTime}
                className="absolute left-1/2 px-4 py-2 border border-slate-500 h-8 rounded-md shadow-sm focus:outline-none ml-12"
              ></input>
            </div>
            <div className="p-3 bg-slate-100">
              <label for="arrival-time" className="text-xl font-medium">
                Original Arrival Date And Time Of Flight
              </label>
              <input
                type="datetime-local"
                id="arrival-time"
                name="arrival-time"
                value={data.arrivalTime}
                className="absolute left-1/2 px-4 py-2 border border-slate-500 h-8 rounded-md shadow-sm focus:outline-none ml-12"
                disabled
                ></input>
            </div>
            <div className="p-3">
              <label for="flightNo" className="text-xl font-medium">
                Original Duration
              </label>
              <input
                type="text"
                name="flightNo"
                value={timeDifference(data.departureTime, data.arrivalTime)}
                disabled
                id="flightNo"
                className="border border-slate-500 w-60 absolute left-1/2 h-8 p-2"
              ></input>
            </div>
            <div className=" p-3">
              <label for="departure-time" className="text-xl font-medium">
                Enter New Departure Date And Time Of Flight
              </label>
              <input
                type="datetime-local"
                id="departure-time"
                name="departure-time"
                required
                value={departureTime}
                className="absolute left-1/2 px-4 py-2 border border-slate-500 h-8 rounded-md shadow-sm focus:outline-none ml-12"
                onChange={handleDeparture}
              ></input>
            </div>
            <div className="p-3 bg-slate-100">
              <label for="arrival-time" className="text-xl font-medium">
                Select New Arrival Date And Time Of Flight
              </label>
              <input
                type="datetime-local"
                id="arrival-time"
                name="arrival-time"
                required
                className="absolute left-1/2 px-4 py-2 border border-slate-500 h-8 rounded-md shadow-sm focus:outline-none ml-12"
                disabled={!departureTime}
                onChange={handleArrival}
                ></input>
                {errorMessage ? (<div className="relative left-[23%] text-red-500 text-sm font-bold flex justify-center items-center gap-1 mt-2"><img src="https://cdn-icons-png.flaticon.com/512/16208/16208197.png" alt="" className="h-5 w-5" /> {errorMessage}</div>) : <div></div>}
            </div>
            <div className="p-3">
              <label for="flightNo" className="text-xl font-medium">
                New Duration
              </label>
              <input
                type="text"
                name="flightNo"
                value={duration}
                disabled
                id="flightNo"
                className="border border-slate-500 w-60 absolute left-1/2 h-8 p-2"
              ></input>
            </div>
            <div className="p-3">
              <label for="economyNo" className="text-xl font-medium">
                Economy Class Seats
              </label>
              <input
                type="number"
                name="economyNo"
                id="economyNo"
                value={data.seatsAvailable.economy}
                disabled
                className="border border-slate-500 absolute left-1/2 h-8 p-2"
              ></input>
            </div>
            <div className="p-3 bg-slate-100">
              <label for="businessNo" className="text-xl font-medium">
                Business Class Seats
              </label>
              <input
                type="number"
                name="businessNo"
                id="businessNo"
                value={data.seatsAvailable.business}
                disabled
                className="border border-slate-500 absolute left-1/2 h-8 p-2"
              ></input>
            </div>
            <div className="p-3">
              <label for="firstNo" className="text-xl font-medium">
                First Class Seats
              </label>
              <input
                type="number"
                name="firstNo"
                id="firstNo"
                value={data.seatsAvailable.first}
                disabled
                className="border border-slate-500 absolute left-1/2 h-8 p-2"
              ></input>
            </div>
            <div className="p-3 bg-slate-100">
              <label for="economycost" className="text-xl font-medium">
                Seat Cost For Economy Class
              </label>
              <input
                type="number"
                name="economycost"
                id="economycost"
                value={data.prices.economy}
                disabled
                className="border border-slate-500 absolute left-1/2 h-8 p-2"
              ></input>
            </div>
            <div className=" p-3">
              <label for="businesscost" className="text-xl font-medium">
                Seat Cost For Business Class
              </label>
              <input
                type="number"
                name="businesscost"
                id="businesscost"
                value={data.prices.business}
                disabled
                className="border border-slate-500 absolute left-1/2 h-8 p-2"
              ></input>
            </div>
            <div className="bg-slate-100 p-3">
              <label for="firstcost" className="text-xl font-medium">
                Seat Cost For First Class
              </label>
              <input
                type="number"
                name="firstcosst"
                id="firstcost"
                value={data.prices.first}
                disabled
                className="border border-slate-500 absolute left-1/2 h-8 p-2"
              ></input>
            </div>
            <div className="flex gap-20 justify-center mt-10">
              <button
                type="submit"
                className="bg-[#585eff] w-20 h-10 rounded-md text-white font-semibold"
                onClick={handleSubmit}
              >
                Submit
              </button>
              <button
                type="reset"
                className="bg-[#ee3333] w-20 h-10 rounded-md text-white font-semibold"
              >
                Back
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ReSchedule;
