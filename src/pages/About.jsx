import React from 'react'

function About() {

  return (
    <div className='min-h-screen w-full bg-gradient-to-br from-purple-50 via-white to-blue-50 pb-12 relative'>
      {/* Animated background particles */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute w-96 h-96 -top-48 -left-48 bg-purple-400/10 rounded-full blur-3xl animate-pulse'></div>
        <div className='absolute w-96 h-96 -bottom-48 -right-48 bg-blue-400/10 rounded-full blur-3xl animate-pulse' style={{animationDelay: '2s'}}></div>
        <div className='absolute w-64 h-64 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-300/10 to-blue-300/10 rounded-full blur-2xl animate-float'></div>
      </div>
      
      <div className='relative bg-white/80 backdrop-blur-md w-[96%] md:w-[90%] lg:w-[80%] h-full m-auto pb-8 rounded-3xl shadow-2xl border border-gradient-to-r from-purple-200/50 to-blue-200/50 overflow-hidden'>
        {/* Decorative gradient orbs */}
        <div className='absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-300/20 to-blue-300/20 rounded-full blur-3xl animate-spin-slow'></div>
        <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-300/20 to-purple-300/20 rounded-full blur-3xl animate-spin-slow' style={{animationDirection: 'reverse'}}></div>
        
        {/* Header section with animated gradient text */}
        <div className='relative z-10 text-center py-10 px-8 md:px-16 lg:px-32'>
          <div className='inline-block animate-fade-in'>
            <h1 className='text-5xl md:text-6xl lg:text-7xl font-extrabold bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 animate-gradient bg-300%'>
              Flyhigh
            </h1>
            <div className='h-1 w-32 mx-auto bg-gradient-to-r from-purple-600 to-blue-600 rounded-full animate-width-expand'></div>
          </div>
          <p className='text-lg md:text-xl text-gray-600 leading-relaxed mt-6 animate-fade-in-up max-w-3xl mx-auto'>
            Revolutionizing air travel booking with cutting-edge technology and unmatched service. Experience the future of flight reservations today.
          </p>
          {/* Stats section */}
          <div className='grid grid-cols-3 gap-4 mt-8 max-w-2xl mx-auto animate-fade-in-up' style={{animationDelay: '0.3s'}}>
            <div className='text-center'>
              <div className='text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent'>500K+</div>
              <div className='text-sm text-gray-600'>Happy Travelers</div>
            </div>
            <div className='text-center'>
              <div className='text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>1000+</div>
              <div className='text-sm text-gray-600'>Daily Flights</div>
            </div>
            <div className='text-center'>
              <div className='text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent'>50+</div>
              <div className='text-sm text-gray-600'>Airlines</div>
            </div>
          </div>
        </div>
        
        {/* Mission section */}
        <div className='w-[94%] m-auto flex flex-col md:flex-row justify-between items-center gap-8 mt-12 animate-slide-up'>
          <div className='w-full md:w-2/3 group relative'>
            <div className='absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300'></div>
            <div className='relative bg-gradient-to-br from-purple-50/90 to-blue-50/90 backdrop-blur-sm p-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-purple-100/30'>
              <div className='flex items-center gap-3 mb-6'>
                <div className='w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center animate-bounce-slow'>
                  <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M13 10V3L4 14h7v7l9-11h-7z'></path>
                  </svg>
                </div>
                <h2 className='text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent'>Our Mission</h2>
              </div>
              <p className='text-gray-700 leading-relaxed text-lg'>Transforming flight booking through innovation. We leverage AI-powered search, real-time pricing, and seamless user experience to make booking flights as simple as a single click.</p>
              <div className='mt-6 flex flex-wrap gap-3'>
                <span className='px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium'>Innovation First</span>
                <span className='px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium'>24/7 Support</span>
                <span className='px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium'>Best Prices</span>
              </div>
            </div>
          </div>
          <div className='relative w-full md:w-[30%] h-72 group'>
            <div className='absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-300'></div>
            <div className='relative h-full overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300'>
              <img src='/mission.jpeg' className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700'></img>
              <div className='absolute inset-0 bg-gradient-to-t from-purple-900/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
            </div>
          </div>
        </div>
        
        {/* Who We Are section */}
        <div className='w-[94%] m-auto flex flex-col md:flex-row justify-between items-center gap-8 mt-12 animate-slide-up' style={{animationDelay: '0.2s'}}>
          <div className='relative w-full md:w-[30%] h-72 group order-2 md:order-1'>
            <div className='absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-300'></div>
            <div className='relative h-full overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300'>
              <img src='/whoweare.webp' className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700'></img>
              <div className='absolute inset-0 bg-gradient-to-t from-blue-900/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
            </div>
          </div>
          <div className='w-full md:w-2/3 group relative order-1 md:order-2'>
            <div className='absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300'></div>
            <div className='relative bg-gradient-to-br from-blue-50/90 to-purple-50/90 backdrop-blur-sm p-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-blue-100/30'>
              <div className='flex items-center gap-3 mb-6'>
                <div className='w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center animate-pulse'>
                  <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'></path>
                  </svg>
                </div>
                <h2 className='text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>Who We Are</h2>
              </div>
              <p className='text-gray-700 leading-relaxed text-lg'>A team of tech innovators and travel enthusiasts building the future of flight booking. With expertise in AI, data science, and user experience, we're creating smarter ways to connect you with your destinations.</p>
              <div className='mt-6 grid grid-cols-2 gap-4'>
                <div className='text-center p-3 bg-white/50 rounded-lg'>
                  <div className='text-2xl font-bold text-blue-600'>50+</div>
                  <div className='text-sm text-gray-600'>Expert Team</div>
                </div>
                <div className='text-center p-3 bg-white/50 rounded-lg'>
                  <div className='text-2xl font-bold text-purple-600'>2024</div>
                  <div className='text-sm text-gray-600'>Founded</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Commitment section */}
        <div className='w-[94%] m-auto flex flex-col md:flex-row justify-between items-center gap-8 mt-12 animate-slide-up' style={{animationDelay: '0.4s'}}>
          <div className='w-full md:w-2/3 group relative'>
            <div className='absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300'></div>
            <div className='relative bg-gradient-to-br from-purple-50/90 to-blue-50/90 backdrop-blur-sm p-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-purple-100/30'>
              <div className='flex items-center gap-3 mb-6'>
                <div className='w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center animate-spin-slow'>
                  <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'></path>
                  </svg>
                </div>
                <h2 className='text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent'>Our Promise</h2>
              </div>
              <p className='text-gray-700 leading-relaxed text-lg'>Excellence powered by technology. We guarantee secure transactions, transparent pricing, and instant confirmations. Your data is protected with enterprise-grade security, and our AI ensures you always get the best available deals.</p>
              <div className='mt-6 grid grid-cols-2 md:grid-cols-4 gap-3'>
                <div className='text-center'>
                  <div className='w-12 h-12 mx-auto mb-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg flex items-center justify-center'>
                    <svg className='w-6 h-6 text-purple-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'></path>
                    </svg>
                  </div>
                  <div className='text-xs font-medium text-gray-600'>Secure</div>
                </div>
                <div className='text-center'>
                  <div className='w-12 h-12 mx-auto mb-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center'>
                    <svg className='w-6 h-6 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M13 10V3L4 14h7v7l9-11h-7z'></path>
                    </svg>
                  </div>
                  <div className='text-xs font-medium text-gray-600'>Fast</div>
                </div>
                <div className='text-center'>
                  <div className='w-12 h-12 mx-auto mb-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg flex items-center justify-center'>
                    <svg className='w-6 h-6 text-purple-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'></path>
                    </svg>
                  </div>
                  <div className='text-xs font-medium text-gray-600'>Reliable</div>
                </div>
                <div className='text-center'>
                  <div className='w-12 h-12 mx-auto mb-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center'>
                    <svg className='w-6 h-6 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'></path>
                    </svg>
                  </div>
                  <div className='text-xs font-medium text-gray-600'>Best Price</div>
                </div>
              </div>
            </div>
          </div>
          <div className='relative w-full md:w-[30%] h-72 group'>
            <div className='absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-300'></div>
            <div className='relative h-full overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300'>
              <img src='/commitment.jpeg' className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700'></img>
              <div className='absolute inset-0 bg-gradient-to-t from-purple-900/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translate(-50%, -50%) translateY(0);
          }
          50% {
            transform: translate(-50%, -50%) translateY(-20px);
          }
        }
        
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes width-expand {
          from {
            width: 0;
          }
          to {
            width: 8rem;
          }
        }
        
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        
        .animate-width-expand {
          animation: width-expand 1s ease-out forwards;
        }
        
        .animate-gradient {
          animation: gradient 3s ease infinite;
          background-size: 300% 300%;
        }
        
        .bg-300\% {
          background-size: 300% 300%;
        }
      `}</style>
    </div>
  )
}

export default About
