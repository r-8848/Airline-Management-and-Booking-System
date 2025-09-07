import { useEffect, useState } from 'react'
import React from 'react'
import { Link } from 'react-router-dom';
import { logout } from '../utils/api';

const Navbar = ({user, setUser}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navbar, setNavbar] = useState(false);
  const [showPopup, setShowPopup] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 6000); // Start fade out after 10 seconds

    // Cleanup the timer if the component unmounts before the 10 seconds
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (fadeOut) {
      const fadeTimer = setTimeout(() => {
        setShowPopup(false);
      }, 1000); // Fade out duration

      return () => clearTimeout(fadeTimer);
    }
  }, [fadeOut]);
  
  const bgchange = () => {
    if(window.scrollY >= 90)
      setNavbar(true);
    else
      setNavbar(false);
  }
  window.addEventListener('scroll', bgchange)

  const handleUserCheck = (e) => {
    if (!user) {
      e.preventDefault();
      alert('You must be logged in to access this page.');
    }
  };

  const status = async () => {
    console.log('Status Update');
      const response = await fetch('http://localhost:3000/api/update-profile-on', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          status: 0,
        }),
      });
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Network response was not ok: ${response.statusText}, ${errorMessage}`);
      }
      const result = await response.json();
      console.log('Status:', result);
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };
  return (
    <nav className={`${navbar ? 'bg-black' : 'bg-transparent'} flex justify-between items-center text-white h-16 gap-4 md:gap-4 px-6 sticky top-0 z-10 transition-all duration-300 w-screen`}>
    {/* <nav className={navbar ? "flex justify-around items-center bg-black text-white h-16 gap-11 sticky top-0 z-10":"flex justify-around items-center bg-transparent text-white h-16 gap-11 sticky top-0 z-10"}> */}
    <button
        className="md:hidden block text-xl"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        ☰
      </button>
      <div className='flex justify-center items-center gap-2 md:gap-4'>
        <img src="/plane.png" alt="" className='h-8 w-8 md:h-10 md:w-10'/>
        <div className="logo font-bold text-xl">
          Flyhigh
        </div>
      </div>
      <div
        className={`fixed top-0 left-0 h-full bg-black text-white p-8 transform transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:hidden`}
      >
        <button
          className="text-xl"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          ✕
        </button>
        <ul className="flex flex-col gap-4 mt-4">
          <li><Link to="/" onClick={() => setIsMobileMenuOpen(false)}>HOME</Link></li>
          <li>{user ? (
            <Link to="/myflts" state={{ email: user.email }} onClick={(e) => { handleUserCheck(e); setIsMobileMenuOpen(false); }}>MY FLIGHTS</Link>
          ) : (
            <Link to="/" onClick={(e) => { handleUserCheck(e); setIsMobileMenuOpen(false); }}>MY FLIGHTS</Link>
          )}
          </li>
          <li><Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>ABOUT</Link></li>
          <li>{user ? (
            <Link to="/feedback" onClick={(e) => { handleUserCheck(e); setIsMobileMenuOpen(false); }}>FEEDBACK</Link>
          ) : (
            <Link to="/" onClick={(e) => { handleUserCheck(e); setIsMobileMenuOpen(false); }}>FEEDBACK</Link>
          )}
          </li>
        </ul>
      </div>
      <div className="hidden md:block">
        <ul className="flex flex-col md:flex-row font-bold gap-4 md:gap-20">
            <li><Link to="/">HOME</Link></li>
            <li>{user ? (<Link to="/myflts" state={{email: user.email}} onClick={handleUserCheck}>MY FLIGHTS</Link>) : (<Link to="/" onClick={handleUserCheck}>MY FLIGHTS</Link>)}</li>
            <li><Link to="/about">ABOUT</Link></li>
            <li>{user ? (<Link to="/feedback" onClick={handleUserCheck}>FEEDBACK</Link>) : (<Link to="/" onClick={handleUserCheck}>FEEDBACK</Link>)}</li>
        </ul>
      </div>
      {/* <div id="google_translate"></div> */}
      {!user ? (
        <Link to="/login">
        <div className="btn flex justify-center items-center border-2 p-2 px-4 rounded-full bg-transparent hover:bg-gradient-to-r hover:from-purple-400 hover:to-blue-500 transition duration-300 hover:border-blue-950 hover:text-blue-950">
            <button className='font-bold text-xl'>Login</button>
            <img src="/login.svg" className="h-6 w-6 md:h-8 md:w-8 invert hover:filter-none" alt="login" />
        </div>
        </Link>
      ) : (
        <>
        <Link to='/user' state={{userData: user}} className="relative">
          <div className='flex justify-center items-center gap-2'>
            <img src="/avatar.png" alt="" className='h-5 w-5 md:h-6 md:w-6'/>
            <div className='font-bold'>{user.title} {user.firstName} {user.lastName}</div>
          </div>
          {showPopup && (
            <div className={`absolute top-full mt-2 left-1/2 transform -translate-x-1/2 transition-opacity duration-1000 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
              <div className="relative bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                Do Complete Your Profile, Here
                <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-gray-800"></div>
              </div>
            </div>
          )}
        </Link>
        <Link to="/">
        <div onClick={handleLogout} className="btn flex justify-center items-center border-2 p-2 px-4 rounded-full bg-transparent hover:bg-gradient-to-r hover:from-purple-400 hover:to-blue-500 transition duration-300 hover:border-blue-950 hover:text-blue-950">
            <button className='font-bold text-xl'>Logout</button>
            <img src="/logout.svg" className="h-6 w-6 md:h-8 md:w-8 invert hover:filter-none" alt="login" />
        </div>
        </Link>
        </>
      )}
    </nav>
  )
}

export default Navbar
