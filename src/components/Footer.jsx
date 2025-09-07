import React from 'react'

const Footer = () => {
  return (
    <footer className='w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden'>
      {/* Animated background elements */}
      <div className='absolute inset-0 opacity-20'>
        <div className='absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-3xl animate-pulse'></div>
        <div className='absolute bottom-0 left-0 w-96 h-96 bg-indigo-600 rounded-full blur-3xl animate-pulse' style={{animationDelay: '2s'}}></div>
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600 rounded-full blur-3xl animate-pulse' style={{animationDelay: '4s'}}></div>
      </div>
      
      <div className='relative px-6 md:px-12 lg:px-20 py-8 md:py-10'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8 text-white max-w-7xl mx-auto'>
          {/* Logo Section */}
          <div className='text-center md:text-left'>
            <div className='flex flex-col items-center md:items-start'>
              <img src="/plane.png" className='w-14 h-14 mb-1 opacity-90 hover:opacity-100 transition-opacity' alt="Flyhigh plane" />
              <h3 className='text-2xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent mb-1 animate-gradient'>Flyhigh</h3>
              <p className='text-gray-400 text-xs font-light'>Your journey begins with us</p>
            </div>
          </div>
            
          {/* Information Links */}
          <div className='text-center md:text-left'>
            <h4 className='text-lg font-semibold mb-3 text-white uppercase tracking-wide'>Quick Links</h4>
            <ul className='space-y-2'>
              <li>
                <a href="/" className='text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center gap-2 justify-center md:justify-start group'>
                  <div className='w-8 h-8 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-lg flex items-center justify-center group-hover:from-blue-600/30 group-hover:to-indigo-600/30 transition-all'>
                    <svg className='w-4 h-4' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                    </svg>
                  </div>
                  <span className='font-medium'>Home</span>
                </a>
              </li>
              <li>
                <a href="/about" className='text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center gap-2 justify-center md:justify-start group'>
                  <div className='w-8 h-8 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-lg flex items-center justify-center group-hover:from-blue-600/30 group-hover:to-indigo-600/30 transition-all'>
                    <svg className='w-4 h-4' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <span className='font-medium'>About</span>
                </a>
              </li>
              <li>
                <a href="/feedback" className='text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center gap-2 justify-center md:justify-start group'>
                  <div className='w-8 h-8 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-lg flex items-center justify-center group-hover:from-blue-600/30 group-hover:to-indigo-600/30 transition-all'>
                    <svg className='w-4 h-4' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                    </svg>
                  </div>
                  <span className='font-medium'>Feedback</span>
                </a>
              </li>
            </ul>
          </div>
            
          {/* Services Section */}
          <div className='text-center md:text-left'>
            <h4 className='text-lg font-semibold mb-3 text-white uppercase tracking-wide'>Services</h4>
            <ul className='space-y-2'>
              <li>
                <a href="#" className='text-gray-400 hover:text-indigo-400 transition-colors duration-200 flex items-center gap-2 justify-center md:justify-start'>
                  <span className='text-sm'>Flight Booking</span>
                </a>
              </li>
              <li>
                <a href="#" className='text-gray-400 hover:text-indigo-400 transition-colors duration-200 flex items-center gap-2 justify-center md:justify-start'>
                  <span className='text-sm'>Check-in Online</span>
                </a>
              </li>
              <li>
                <a href="#" className='text-gray-400 hover:text-indigo-400 transition-colors duration-200 flex items-center gap-2 justify-center md:justify-start'>
                  <span className='text-sm'>Manage Booking</span>
                </a>
              </li>
              <li>
                <a href="#" className='text-gray-400 hover:text-indigo-400 transition-colors duration-200 flex items-center gap-2 justify-center md:justify-start'>
                  <span className='text-sm'>Flight Status</span>
                </a>
              </li>
              <li>
                <a href="#" className='text-gray-400 hover:text-indigo-400 transition-colors duration-200 flex items-center gap-2 justify-center md:justify-start'>
                  <span className='text-sm'>Special Offers</span>
                </a>
              </li>
            </ul>
          </div>
            
          {/* Contact Information */}
          <div className='text-center md:text-left'>
            <h4 className='text-lg font-semibold mb-3 text-white uppercase tracking-wide'>Get in Touch</h4>
            <div className='space-y-3'>
              <a href="mailto:Flyhigh@gmail.com" className='text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center gap-3 justify-center md:justify-start group'>
                <div className='w-8 h-8 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-lg flex items-center justify-center group-hover:from-blue-600/30 group-hover:to-indigo-600/30 transition-all'>
                  <svg className='w-4 h-4' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <span className='font-medium text-sm'>Flyhigh@gmail.com</span>
              </a>
              <div className='text-gray-300 flex items-center gap-3 justify-center md:justify-start'>
                <div className='w-8 h-8 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-lg flex items-center justify-center'>
                  <svg className='w-4 h-4' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                </div>
                <span className='font-medium text-sm'>+91 123 456 7890</span>
              </div>
            </div>
            
            {/* Social Media */}
            <div className='mt-4'>
              <p className='text-xs text-gray-400 mb-2'>Follow us on</p>
              <div className='flex gap-2 justify-center md:justify-start'>
                <a href="#" className='w-8 h-8 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-lg flex items-center justify-center hover:from-blue-600/30 hover:to-indigo-600/30 transition-all duration-200 hover:scale-110'>
                  <svg className='w-4 h-4' fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className='w-8 h-8 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-lg flex items-center justify-center hover:from-blue-600/30 hover:to-indigo-600/30 transition-all duration-200 hover:scale-110'>
                  <svg className='w-4 h-4' fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className='w-8 h-8 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-lg flex items-center justify-center hover:from-blue-600/30 hover:to-indigo-600/30 transition-all duration-200 hover:scale-110'>
                  <svg className='w-4 h-4' fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Copyright content */}
      <div className='relative flex justify-center items-center h-20 px-8 border-t border-gray-800'>
        <div className='text-center'>
          <p className='text-gray-300 text-sm md:text-base font-medium'>
            Copyright © 2025 Made by{' '}
            <span className='bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent font-bold'>
              Rahul Maheswari
            </span>
            . All rights reserved
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
