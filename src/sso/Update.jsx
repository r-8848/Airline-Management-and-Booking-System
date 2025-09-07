import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminMenu from "../components/AdminMenu";
import AdminNav from "../components/AdminNav";

function Update() {
  const [flights, setFlights] = useState([]);
	const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
	const [loading, setLoading] = useState(true);
	const [isOpen, setIsOpen] = useState(false);
	
  useEffect(() => {
    const fetchFlights = async () => {
			  setLoading(true);
        const response = await fetch(`https://airline-management-and-booking-syst.vercel.app/api/flightinfo?page=${page}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
				const flightsData = data.fltinfo;
				setTotalPages(data.totalPages);
        // console.log(flightsData);

        const flightsWithDetails = [];
        for (const flight_ of flightsData) {
          const detailsResponse = await fetch('https://airline-management-and-booking-syst.vercel.app/api/flights');
          if (detailsResponse.ok) {
            const detailsData = await detailsResponse.json();
            const flightDetails = detailsData.filter(flight =>
              flight.flightNumber === flight_.flightNumber
              );
            if(flightDetails.length > 0)
            {
              flightsWithDetails.push({
                ...flight_,
                flightName: flightDetails[0].flightName,
                originAirport: flightDetails[0].originAirport,
                destinationAirport: flightDetails[0].destinationAirport,
              });
            }
          }
        }
        console.log(flightsWithDetails)
        setFlights(flightsWithDetails);
				setLoading(false);
    };

    fetchFlights();
  }, [page]);

  const formatDateTime = (dateTimeString) => {
    if (typeof dateTimeString !== 'string')
    return "Invalid Date";
    const [datePart, timePart] = dateTimeString.split('T');
    const [year, month, day] = datePart.split('-');
    const [hours, minutes] = timePart.split(':');
    const formattedDate = `${day}-${month}-${year}`;
    const formattedTime = `${hours}:${minutes}`;
    return `${formattedDate} ${formattedTime}`;
  };

  const getStatus = (departureTime, arrivalTime) => {
    const currentTime = new Date();
    const departureDateTime = new Date(departureTime);
    const arrivalDateTime = new Date(arrivalTime);

    console.log(currentTime);
    if (currentTime < departureDateTime) return 'Yet to Depart';
    if (currentTime >= departureDateTime && currentTime < arrivalDateTime) return 'In Flight';
    if (currentTime >= arrivalDateTime) return 'Arrived';
    return 'Departed';
};

useEffect(() => {
  const intervalId = setInterval(() => {
    setFlights((prevFlights) =>
      prevFlights.map((flight) => ({
        ...flight,
        status: getStatus(flight.selectedDate, flight.departureTime, flight.arrivalTime)
      }))
    );
  }, 1000);

  return () => clearInterval(intervalId);
}, [flights]);

  const Hours = (departureTime) => {
    const currentTime = new Date();
    const depTime = new Date(departureTime);
    return (depTime-currentTime)/(1000*60*60);
  }

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
        <div className="w-full bg-white relative rounded-xl shadow-lg p-6 pt-8 mt-4">
          <div className="flex justify-between">
            <div className="text-3xl font-semibold text-slate-600">
              SCHEDULED FLIGHTS DETAILS
            </div>
            {/* <Link to="http:localhost:5173/admin/updateflt">
              <button className="bg-[#ffc637] px-5 py-2 rounded-md font-bold flex items-center cursor-pointer">
              <i className="fa-solid fa-plane pr-2 rotate-[-45deg] mb-1"></i>
                <span className="ml-1">SCHEDULE FLIGHT</span>
              </button>
            </Link> */}
          </div>
            <div className="mt-3 text-red-500 font-bold">
              <span className="text-blue-500">Flight can only be Edited till</span> 24 hrs <span className="text-blue-500">before the Scheduled Departure.</span>
            </div>
            <div className="mt-3 text-red-500 font-bold">
              <span className="text-blue-500">Flight can only be Re-Scheduled till</span> 5 hrs <span className="text-blue-500">before the Scheduled Departure.</span>
            </div>
          <div className="flex mt-12">
            <input
              type="search"
              name="query"
              autoComplete="on"
              placeholder="you can search here"
              className="border-2 w-64 p-1 rounded-md"
            ></input>
            <button
              type="submit"
              className="bg-[#383eff] px-3 rounded-md ml-4 text-white flex items-center cursor-pointer"
            >
              <span className='mr-1'>Search</span>
              <i className="fa fa-search"></i>
            </button>
            <p className="text-slate-400 mt-1 ml-2">
              (You can search using flight number)
            </p>
          </div>
					<div className="flex justify-center items-center mt-8 space-x-4">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-lg font-medium">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="mt-8">
            <table className="border-2 border-collapse w-full table-auto text-center">
              <thead className="border-2">
                <tr>
                  <th className="border-2 px-4 py-2">#</th>
                  <th className="border-2 px-4 py-2">AIRLINE NAME</th>
                  <th className="border-2 px-4 py-2">FLIGHT NO</th>
                  <th className="border-2 px-4 py-2">SRC</th>
                  <th className="border-2 px-4 py-2">DEST</th>
                  <th className="border-2 px-4 py-2">DEPT DATE & TIME</th>
                  <th className="border-2 px-4 py-2">ARR DATE & TIME</th>
                  <th className="border-2 px-4 py-2">
                    SEAT CONFIGURATION
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      <div className="bg-gray-200 p-1 rounded" title="Economy Class">E</div>
                      <div className="bg-gray-200 p-1 rounded" title="Business Class">B</div>
                      <div className="bg-gray-200 p-1 rounded" title="First Class">F</div>
                    </div>
                  </th>
                  <th className="border-2 px-4 py-2">TOTAL SEATS</th>
                  <th className="border-2 px-4 py-2">
                    COST CONFIGURATION
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      <div className="bg-gray-200 p-1 rounded" title="Economy Class">E</div>
                      <div className="bg-gray-200 p-1 rounded" title="Business Class">B</div>
                      <div className="bg-gray-200 p-1 rounded" title="First Class">F</div>
                    </div>
                  </th>
                  {/* <th className="border-2">CEC</th>
                  <th className="border-2">CBC</th>
                  <th className="border-2">CFC</th> */}
                  <th className="border-2 px-4 py-2">MAKE CHANGES</th>
                </tr>
              </thead>
              <tbody>
                {/* <tr>
                  <td className="border-2 px-4 py-2">3</td>
                  <td className="border-2 px-4 py-2">Vistara</td>
                  <td className="border-2 px-4 py-2">506</td>
                  <td className="border-2 px-4 py-2">NSK</td>
                  <td className="border-2 px-4 py-2">BOM</td>
                  <td className="border-2 px-4 py-2">2024-05-05 23:46</td>
                  <td className="border-2 px-4 py-2">2024-05-06 01:45</td>
                  <td className="border-2 px-4 py-2">BOM</td>
                  <td className="border-2 px-4 py-2">BOM</td>
                  <td className="border-2 px-4 py-2">BOM</td> */}
                  {/* <td className="border-2">1000</td>
                  <td className="border-2">8000</td>
                  <td className="border-2">5000</td> */}
                  {/* <td className="border-2 px-4 py-2">
                    <div className="flex gap-1 justify-center">
                      <button className="bg-[#bf2ad3] px-2 py-0.5 rounded-md text-white cursor-pointer">
                        Edit
                      </button>
                      <button className="bg-[#ff3838] px-2 py-0.5 rounded-md text-white cursor-pointer">
                        Remove
                      </button>
                      <button className="bg-[#65a0ff] px-2 py-0.5 rounded-md text-white cursor-pointer">
                        View
                      </button>
                    </div>
                  </td>
                </tr> */}
                {/* <tr>
                  <td className="border-2 px-4 py-2">3</td>
                  <td className="border-2 px-4 py-2">Emirates</td>
                  <td className="border-2 px-4 py-2">108</td>
                  <td className="border-2 px-4 py-2">NSK</td>
                  <td className="border-2 px-4 py-2">BOM</td>
                  <td className="border-2 px-4 py-2">BOM</td>
                  <td className="border-2 px-4 py-2">2024-05-04 23:50</td>
                  <td className="border-2 px-4 py-2">2024-05-05 00:50</td>
                  <td className="border-2 px-4 py-2">BOM</td>
                  <td className="border-2 px-4 py-2">BOM</td>
                  <td className="border-2 px-4 py-2">BOM</td> */}
                  {/* <td className="border-2">1000</td>
                  <td className="border-2">8000</td>
                  <td className="border-2">5000</td> */}
                  {/* <td className="border-2 px-4 py-2">
                    <div className="flex gap-1 justify-center">
                      <button className="bg-[#d3e73e] px-2 py-0.5 rounded-md text-white cursor-pointer">
                        Running
                      </button>
                      <button className="bg-[#65a0ff] px-2 py-0.5 rounded-md text-white cursor-pointer">
                        View
                      </button>
                    </div>
                  </td>
                </tr> */}
								{loading ? (
									<tr>
                    <td colSpan="100%">
                      <div className="flex justify-center items-center py-4">
                        <img src="/loader.gif" alt="loader" className="h-20 w-20" />
                      </div>
                    </td>
                  </tr>
								):(
									<>
		                {flights.map((flights, index) => (
		                  <tr key={index}>
		                    <td className="border-2 px-4 py-2">{(page - 1) * 10 + index + 1}</td>
		                    <td className="border-2 px-4 py-2">{flights.flightName}</td>
		                    <td className="border-2 px-4 py-2">{flights.flightNumber}</td>
		                    <td className="border-2 px-4 py-2">{flights.originAirport}</td>
		                    <td className="border-2 px-4 py-2">{flights.destinationAirport}</td>
		                    <td className="border-2 px-4 py-2">{formatDateTime(flights.newdepTime)}</td>
		                    <td className="border-2 px-4 py-2">{formatDateTime(flights.newarrTime)}</td>
		                    {/* <td className="border-2 px-4 py-2">{flights.seatsAvailable.economy}, {flights.seatsAvailable.business}, {flights.seatsAvailable.first}</td> */}
		                    <td className="border-2 px-4 py-2">
		                      <div className="grid grid-cols-3 gap-2">
		                        <div className="bg-gray-200 p-1 rounded">{flights.seatsAvailable.economy}</div>
		                        <div className="bg-gray-200 p-1 rounded">{flights.seatsAvailable.business}</div>
		                        <div className="bg-gray-200 p-1 rounded">{flights.seatsAvailable.first}</div>
		                      </div>
		                    </td>
		                    <td className="border-2 px-4 py-2">{Math.max(flights.seatsAvailable.economy, 0)+Math.max(flights.seatsAvailable.business, 0)+Math.max(flights.seatsAvailable.first, 0)}</td>
		                    <td className="border-2 px-4 py-2">
		                      <div className="grid grid-cols-3 gap-2">
		                        <div className="bg-gray-200 p-1 rounded">{flights.prices.economy}</div>
		                        <div className="bg-gray-200 p-1 rounded">{flights.prices.business}</div>
		                        <div className="bg-gray-200 p-1 rounded">{flights.prices.first}</div>
		                      </div>
		                    </td>
		                    {/* <td className="border-2">1000</td>
		                    <td className="border-2">8000</td>
		                    <td className="border-2">5000</td> */}
		                    <td className="border-2 px-4 py-2">
		                      <div className="flex gap-1 justify-center">
		                        {getStatus(flights.departureTime, flights.arrivalTime) === "Yet to Depart" ? (
		                          <>
		                          {Hours(flights.departureTime) >= 24 ? (
		                            <Link to='/admin/editfltinfo' state={{flightName: flights.flightName, flightNumber: flights.flightNumber, originAirport: flights.originAirport, destinationAirport: flights.destinationAirport, olddepTime: flights.departureTime}}>
		                            <button type="button" className="font-bold focus:outline-none w-20 text-white bg-[#bf2ad3] hover:bg-[#821d90] focus:ring-4 focus:ring-purple-300 rounded-lg text-sm px-5 py-2.5 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800 m-2 mr-1">
		                              Edit
		                            </button></Link>
		                          ):(
		                            <>
		                              {Hours(flights.departureTime) >= 5 ? (
		                                <Link to='/admin/reschedule' state={{flightName: flights.flightName, flightNumber: flights.flightNumber, originAirport: flights.originAirport, destinationAirport: flights.destinationAirport, departureTime: flights.departureTime, arrivalTime: flights.arrivalTime, seatsAvailable: flights.seatsAvailable, prices: flights.prices}}>
		                                <button type="button" className="font-bold focus:outline-none w-32 text-white bg-[#0ed485] hover:bg-[#0a8f5a] focus:ring-4 focus:ring-green-300 rounded-lg text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 m-2 ml-0 mr-1">
		                                  Re-Schedule
		                                </button>
		                                </Link>
		                              ):(
		                                <div></div>
		                              )}
		                            </>
		                          )}
		                          <button type="button" className="font-bold focus:outline-none w-22 text-white bg-red-600 hover:bg-[#970303] focus:ring-4 focus:ring-red-300 rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 m-2 ml-0 mr-1">
		                            Remove
		                          </button>
		                          </>
		                        ):(
		                          <div className={`font-bold w-20 text-white rounded-lg text-sm px-2.5 py-2.5 m-2 ml-1 mr-1 ${getStatus(flights.departureTime, flights.arrivalTime) === 'Arrived' ? 'bg-[#3aa228]' : (getStatus(flights.departureTime, flights.arrivalTime) === 'In Flight' ? 'bg-yellow-500' : 'bg-red-700')}`}>
		                            {getStatus(flights.departureTime, flights.arrivalTime)}
		                          </div>
		                        )}
		                        {/* <button className="bg-[#65a0ff] px-2 py-0.5 rounded-md text-white cursor-pointer">
		                          View
		                        </button> */}
		                        <Link to='/admin/passlist' state={{flightName: flights.flightName, flightNumber: flights.flightNumber, departureTime: flights.departureTime, arrivalTime: flights.arrivalTime, originAirport: flights.originAirport, destinationAirport: flights.destinationAirport}}>
		                        <button type="button" className="font-bold focus:outline-none w-20 text-white bg-[#1f82ac] hover:bg-[#155a78] focus:ring-4 focus:ring-blue-300 rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 m-2 ml-0">
		                          View
		                        </button>
		                        </Link>
		                      </div>
		                    </td>
		                  </tr>
		                ))}
									</>
								)}
              </tbody>
            </table>
          </div>
					<div className="flex justify-center items-center mt-8 space-x-4">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-lg font-medium">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Update;
