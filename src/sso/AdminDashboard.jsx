import React, { useState } from 'react'
import AdminMenu from '../components/AdminMenu';
import AdminNav from '../components/AdminNav';


function AdminDashboard() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="grid grid-cols-12 min-h-screen min-w-screen">
{/*           <div className='min-h-screen col-span-3 flex flex-col items-center'>
           <AdminMenu/>
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
          {/* Backdrop when menu is open (optional UX) */}
          {isOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-25 z-30"
              onClick={() => setIsOpen(false)}
            ></div>
          )}
          <div className=' min-h-screen col-span-full p-10 z-10 relative'>
           <AdminNav/>
          </div>
        </div>
      );
}

export default AdminDashboard
