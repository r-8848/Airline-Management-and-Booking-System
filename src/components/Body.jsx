import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Select from "react-select";

const Body = () => {
  const [showBookFlight, setShowBookFlight] = useState(true);
  const [airports, setAirports] = useState([]);
  const [airports_, setAirports_] = useState([]);
  const [originAirport, setOriginAirport] = useState({ value: 'NULL', label: 'Select Origin' });
  const [originAirport_, setOriginAirport_] = useState({ value: 'NULL', label: 'Select Origin' });
  const [destinationAirport, setDestinationAirport] = useState({ value: 'NULL', label: 'Select Destination' });
  const [destinationAirport_, setDestinationAirport_] = useState({ value: 'NULL', label: 'Select Destination' });
  const [filteredAirports, setFilteredAirports] = useState([]);
  const [filteredAirports_, setFilteredAirports_] = useState([]);
  const [passengers, setPassengers] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedDate_, setSelectedDate_] = useState('');

  const navigate = useNavigate();

  const currentDateUTC = new Date();
  const currentDateIST = new Date(currentDateUTC.getTime() + (5.5 * 60 * 60 * 1000));
  const currentDate = currentDateIST.toISOString().split('T')[0];

  const options = airports.map(airport => ({
    value: airport.code,
    label: `${airport.city}, ${airport.country} - ${airport.name}`
  }));

  const options_ = airports_.map(airport => ({
    value: airport.code,
    label: `${airport.city}, ${airport.country} - ${airport.name}`
  }));

  const options__ = filteredAirports.map(airport => ({
    value: airport.code,
    label: `${airport.city}, ${airport.country} - ${airport.name}`
  }));

  const options___ = filteredAirports_.map(airport => ({
    value: airport.code,
    label: `${airport.city}, ${airport.country} - ${airport.name}`
  }));
  
  const handleChangeP = (event) => {
    setPassengers(parseInt(event.target.value));
  };

  const handleChangeD = (event) => {
    setSelectedDate(event.target.value);
  };
  
  const handleChangeD_ = (event) => {
    setSelectedDate_(event.target.value);
  };

  useEffect(() => {
    fetch('http://localhost:3000/api/airports')
      .then(response => response.json())
      .then(data => {
        const Filter = data.filter(airport => airport.code !== destinationAirport.value);
        setAirports(Filter);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [destinationAirport]);

  useEffect(() => {
    fetch('http://localhost:3000/api/airports')
      .then(response => response.json())
      .then(data => {
        const Filter = data.filter(airport => airport.code !== destinationAirport_.value);
        setAirports_(Filter);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [destinationAirport_]);

  useEffect(() => {
    fetch('http://localhost:3000/api/airports')
      .then(response => response.json())
      .then(data => {
        const filtered = data.filter(airport => airport.code !== originAirport.value);
        setFilteredAirports(filtered);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [originAirport]);
  
  useEffect(() => {
    fetch('http://localhost:3000/api/airports')
      .then(response => response.json())
      .then(data => {
        const filtered = data.filter(airport => airport.code !== originAirport_.value);
        setFilteredAirports_(filtered);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [originAirport_]);

  const handleToggle = () => {
    setShowBookFlight(!showBookFlight);
  };

  const handleChange = event => {
    setOriginAirport(event || { value: 'NULL', label: 'Select Origin' });
  };
  
  const handleChangeF = event => {
    setOriginAirport_(event || { value: 'NULL', label: 'Select Origin' });
  };

  const handleChange_ = event => {
    setDestinationAirport(event || { value: 'NULL', label: 'Select Destination' });
  };
  
  const handleChangeF_ = event => {
    setDestinationAirport_(event || { value: 'NULL', label: 'Select Destination' });
  };

  useEffect(() => {
    const setSystemDate = () => {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      setSelectedDate(formattedDate);
      setSelectedDate_(formattedDate);
    };
    setSystemDate();
  }, []);

  const handleSubmit = async () => {
    if (showBookFlight) {
        // Handle booking submission
    } else {
        // Handle flight status submission
    }
  };
  
  return (
    <>
      <video src="/bghome.mp4" autoPlay muted loop className="fixed top-0 object-cover justify-center z-[-1] min-h-screen w-full" />
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
        <div className="absolute w-96 h-96 -top-48 -left-48 bg-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute w-96 h-96 -bottom-48 -right-48 bg-blue-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="flex flex-col justify-center items-center mt-40 md:mt-80 w-[90%] md:w-2/3 lg:w-1/3 animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient bg-300% mb-4">
              Flyhigh
            </h1>
            <p className="text-white text-lg md:text-xl font-medium">Book Your Perfect Flight in Seconds</p>
          </div>
          
          <div className="relative bg-white/90 backdrop-blur-md h-auto w-full max-w-4xl text-black border border-purple-200/50 rounded-3xl shadow-2xl flex flex-col justify-center items-center p-6 hover:shadow-3xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 to-blue-100/20 rounded-3xl pointer-events-none"></div>
            
            <div className="relative mb-1 flex flex-col justify-center gap-y-4 w-full">
              <div className="flex justify-between gap-2">
                <button onClick={handleToggle} className={`w-1/2 px-4 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 ${showBookFlight ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-purple-500/25' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
                    </svg>
                    Book a Flight
                  </span>
                </button>
                <button onClick={handleToggle} className={`w-1/2 px-4 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 ${!showBookFlight ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-purple-500/25' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Flight Status
                  </span>
                </button>
              </div>

              <div style={{ display: showBookFlight ? 'block' : 'none' }} className="w-full space-y-4">
                <div className="group">
                  <label htmlFor="from" className="block text-sm font-semibold text-gray-700 mb-1 group-hover:text-purple-600 transition-colors">
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"></path></svg>
                      From
                    </span>
                  </label>
                  <div className="mt-1 block w-full">
                    <Select id="from" value={originAirport} onChange={handleChange} options={options} placeholder="Select Origin" classNamePrefix="react-select" styles={{ control: (p, s) => ({ ...p, border: s.isFocused ? '2px solid #7c3aed' : '2px solid #e5e7eb', borderRadius: '0.75rem', boxShadow: s.isFocused ? '0 0 0 3px rgba(124, 58, 237, 0.1)' : 'none', padding: '0.25rem', minHeight: '2.75rem', transition: 'all 0.2s', '&:hover': { borderColor: '#7c3aed' } }), menu: p => ({ ...p, borderRadius: '0.75rem', marginTop: '0.25rem', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' }), option: (p, s) => ({ ...p, backgroundColor: s.isSelected ? '#7c3aed' : s.isFocused ? '#f3f4f6' : 'white', color: s.isSelected ? 'white' : 'black', padding: '0.75rem', transition: 'all 0.2s' }) }} isClearable={true} noOptionsMessage={() => "No airports found"} />
                  </div>
                </div>
                <div className="group">
                  <label htmlFor="to" className="block text-sm font-semibold text-gray-700 mb-1 group-hover:text-purple-600 transition-colors">
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                      To
                    </span>
                  </label>
                  <div className="mt-1 block w-full">
                    <Select id="to" value={destinationAirport} onChange={handleChange_} options={options__} placeholder="Select Destination" classNamePrefix="react-select" styles={{ control: (p, s) => ({ ...p, border: s.isFocused ? '2px solid #7c3aed' : '2px solid #e5e7eb', borderRadius: '0.75rem', boxShadow: s.isFocused ? '0 0 0 3px rgba(124, 58, 237, 0.1)' : 'none', padding: '0.25rem', minHeight: '2.75rem', transition: 'all 0.2s', '&:hover': { borderColor: '#7c3aed' } }), menu: p => ({ ...p, borderRadius: '0.75rem', marginTop: '0.25rem', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' }), option: (p, s) => ({ ...p, backgroundColor: s.isSelected ? '#7c3aed' : s.isFocused ? '#f3f4f6' : 'white', color: s.isSelected ? 'white' : 'black', padding: '0.75rem', transition: 'all 0.2s' }) }} isClearable={true} noOptionsMessage={() => "No airports found"} />
                  </div>
                </div>
                <div className="group">
                  <label htmlFor="date" className="block text-sm font-semibold text-gray-700 mb-1 group-hover:text-purple-600 transition-colors">
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      Date
                    </span>
                  </label>
                  <input type="date" id="date" value={selectedDate} onChange={handleChangeD} min={currentDate} name="date" className="mt-1 block w-full border-2 border-gray-300 rounded-xl shadow-sm focus:border-purple-600 focus:ring focus:ring-purple-200 focus:ring-opacity-50 h-12 px-4 transition-all duration-200 hover:border-purple-400" />
                </div>
                <div className="group">
                  <label htmlFor="passengers" className="block text-sm font-semibold text-gray-700 mb-1 group-hover:text-purple-600 transition-colors">
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                      Passengers
                    </span>
                  </label>
                  <input type="number" id="passengers" className="mt-1 block w-full border-2 border-gray-300 rounded-xl shadow-sm focus:border-purple-600 focus:ring focus:ring-purple-200 focus:ring-opacity-50 h-12 px-4 transition-all duration-200 hover:border-purple-400" min="1" value={passengers} onChange={handleChangeP} />
                </div>
              </div>
              
              <div style={{ display: showBookFlight ? 'none' : 'block' }} className="w-full space-y-4">
                <div className="group">
                  <label htmlFor="fromStatus" className="block text-sm font-semibold text-gray-700 mb-1 group-hover:text-purple-600 transition-colors">
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"></path></svg>
                      From
                    </span>
                  </label>
                  <div className="mt-1 block w-full">
                    <Select id="fromStatus" value={originAirport_} onChange={handleChangeF} options={options_} placeholder="Select Origin" classNamePrefix="react-select" styles={{ control: (p, s) => ({ ...p, border: s.isFocused ? '2px solid #7c3aed' : '2px solid #e5e7eb', borderRadius: '0.75rem', boxShadow: s.isFocused ? '0 0 0 3px rgba(124, 58, 237, 0.1)' : 'none', padding: '0.25rem', minHeight: '2.75rem', transition: 'all 0.2s', '&:hover': { borderColor: '#7c3aed' } }), menu: p => ({ ...p, borderRadius: '0.75rem', marginTop: '0.25rem', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' }), option: (p, s) => ({ ...p, backgroundColor: s.isSelected ? '#7c3aed' : s.isFocused ? '#f3f4f6' : 'white', color: s.isSelected ? 'white' : 'black', padding: '0.75rem', transition: 'all 0.2s' }) }} isClearable={true} noOptionsMessage={() => "No airports found"} />
                  </div>
                </div>
                <div className="group">
                  <label htmlFor="toStatus" className="block text-sm font-semibold text-gray-700 mb-1 group-hover:text-purple-600 transition-colors">
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                      To
                    </span>
                  </label>
                  <div className="mt-1 block w-full">
                    <Select id="toStatus" value={destinationAirport_} onChange={handleChangeF_} options={options___} placeholder="Select Destination" classNamePrefix="react-select" styles={{ control: (p, s) => ({ ...p, border: s.isFocused ? '2px solid #7c3aed' : '2px solid #e5e7eb', borderRadius: '0.75rem', boxShadow: s.isFocused ? '0 0 0 3px rgba(124, 58, 237, 0.1)' : 'none', padding: '0.25rem', minHeight: '2.75rem', transition: 'all 0.2s', '&:hover': { borderColor: '#7c3aed' } }), menu: p => ({ ...p, borderRadius: '0.75rem', marginTop: '0.25rem', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' }), option: (p, s) => ({ ...p, backgroundColor: s.isSelected ? '#7c3aed' : s.isFocused ? '#f3f4f6' : 'white', color: s.isSelected ? 'white' : 'black', padding: '0.75rem', transition: 'all 0.2s' }) }} isClearable={true} noOptionsMessage={() => "No airports found"} />
                  </div>
                </div>
                <div className="group">
                  <label htmlFor="dateStatus" className="block text-sm font-semibold text-gray-700 mb-1 group-hover:text-purple-600 transition-colors">
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      Date
                    </span>
                  </label>
                  <input type="date" id="dateStatus" value={selectedDate_} onChange={handleChangeD_} min={currentDate} className="mt-1 block w-full border-2 border-gray-300 rounded-xl shadow-sm focus:border-purple-600 focus:ring focus:ring-purple-200 focus:ring-opacity-50 h-12 px-4 transition-all duration-200 hover:border-purple-400" />
                </div>
              </div>

              <div className="flex justify-center items-center mt-6">
                {showBookFlight ? (
                  <Link to={`/fltlist/origin=${originAirport.value}/destination=${destinationAirport.value}/date=${selectedDate}/passengers=${passengers}`} state={{ originAirport: originAirport.value, destinationAirport: destinationAirport.value, selectedDate, passengers }}>
                    <button type="submit" id="submit" onClick={handleSubmit} disabled={originAirport.value === "NULL" || destinationAirport.value === "NULL"} className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-18 0 7 7 0 0118 0z"></path></svg>
                      Search Flights
                    </button>
                  </Link>
                ) : (
                  <Link to={`/fltstatus/origin=${originAirport_.value}/destination=${destinationAirport_.value}/date=${selectedDate_}`} state={{ originAirport: originAirport_.value, destinationAirport: destinationAirport_.value, selectedDate: selectedDate_ }}>
                    <button type="submit" id="submit" onClick={handleSubmit} disabled={originAirport_.value === "NULL" || destinationAirport_.value === "NULL"} className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                      Check Status
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-around items-center mt-20 w-full h-auto bg-gradient-to-b from-white via-purple-50/30 to-blue-50/30 flex-col">
          <div className="w-[90%] md:w-[85%] animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-12 border border-purple-100/50">
              <div className="relative group h-64 md:h-[350px] w-full md:w-2/5 rounded-2xl overflow-hidden shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent z-10"></div>
                <img src="/airplane.avif" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="airplane" />
                <div className="absolute bottom-4 left-4 right-4 z-20">
                  <h3 className="text-white text-2xl font-bold drop-shadow-lg">Premium Lounges</h3>
                  <p className="text-white/90 text-sm mt-1">Experience luxury at every step</p>
                </div>
              </div>
              <div className="w-full md:w-3/5">
                <div className="text-center md:text-left mb-8">
                  <h2 className="font-bold text-3xl md:text-4xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">Start Planning Your Next Adventure</h2>
                  <p className="text-gray-600 text-lg">Discover world-class amenities and services designed for the modern traveler</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl hover:shadow-lg transition-all duration-300 border border-purple-100/50">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-800 mb-2">Experience Tranquility</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">Serenity Haven offers a tranquil escape, featuring comfortable seating, calming ambiance and attentive service.</p>
                      </div>
                    </div>
                  </div>
                  <div className="group p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl hover:shadow-lg transition-all duration-300 border border-blue-100/50">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-800 mb-2">Elevate Your Experience</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">Designed for discerning travelers, this exclusive lounge offers premium amenities, assistance and private workspace.</p>
                      </div>
                    </div>
                  </div>
                  <div className="group p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl hover:shadow-lg transition-all duration-300 border border-purple-100/50">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-800 mb-2">A Welcoming Space</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">Create a family-friendly atmosphere, The Family Zone is the perfect haven for parents and children.</p>
                      </div>
                    </div>
                  </div>
                  <div className="group p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl hover:shadow-lg transition-all duration-300 border border-blue-100/50">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-800 mb-2">A Culinary Delight</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">Immerse yourself in a world of flavors, offering international cuisines, gourmet dishes and carefully curated beverages.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-[90%] md:w-[85%] mt-20 animate-fade-in-up bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border border-purple-100/50" style={{animationDelay: '0.2s'}}>
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Explore <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Popular Destinations</span>
              </h2>
              <p className="text-gray-700 text-lg font-medium">Discover amazing cities with exclusive flight deals</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="group relative h-64 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer">
                <img src="/mumbai.jpg" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Mumbai" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-2xl font-bold mb-1">Mumbai</h3>
                  <p className="text-white/80 text-sm">City of Dreams</p>
                  <div className="mt-3 flex items-center gap-2 text-white/90 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span>From ₹2,999</span>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-purple-600">
                  Popular
                </div>
              </div>
              <div className="group relative h-64 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer">
                <img src="/kolkata.jpeg" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Kolkata" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-2xl font-bold mb-1">Kolkata</h3>
                  <p className="text-white/80 text-sm">City of Joy</p>
                  <div className="mt-3 flex items-center gap-2 text-white/90 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span>From ₹2,499</span>
                  </div>
                </div>
              </div>
              <div className="group relative h-64 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer">
                <img src="/delhi.jpg" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Delhi" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-2xl font-bold mb-1">Delhi</h3>
                  <p className="text-white/80 text-sm">Capital City</p>
                  <div className="mt-3 flex items-center gap-2 text-white/90 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span>From ₹1,999</span>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-green-500/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-white">
                  Best Deal
                </div>
              </div>
              <div className="group relative h-64 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer">
                <img src="/chennai.jpg" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Chennai" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-2xl font-bold mb-1">Chennai</h3>
                  <p className="text-white/80 text-sm">Gateway to South</p>
                  <div className="mt-3 flex items-center gap-2 text-white/90 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span>From ₹2,799</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes gradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes fly { 0% { transform: translateX(0) translateY(0); } 25% { transform: translateX(-30px) translateY(-10px); } 50% { transform: translateX(-60px) translateY(0); } 75% { transform: translateX(-30px) translateY(10px); } 100% { transform: translateX(0) translateY(0); } }
        .animate-fade-in { animation: fade-in 0.8s ease-out forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; opacity: 0; }
        .animate-gradient { animation: gradient 3s ease infinite; background-size: 300% 300%; }
        .animate-fly { animation: fly 8s ease-in-out infinite; }
        .bg-300\% { background-size: 300% 300%; }
      `}</style>
    </>
  );
}

export default Body;