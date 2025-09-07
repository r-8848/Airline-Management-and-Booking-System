import React from 'react'
import { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { login } from '../utils/api';

const MainBody = ({setUser}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [userType, setUserType] = useState('client');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const status = async () => {
    // console.log('Status Update');
      const response = await fetch('http://localhost:3000/api/update-profile-on', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          status: 1,
        }),
      });
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Network response was not ok: ${response.statusText}, ${errorMessage}`);
      }
      const result = await response.json();
      // console.log('Status:', result);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const result = await login(email, password, userType);
      
      if (result.success) {
        setUser({
          email: result.user.email,
          title: result.user.title,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          mobileNumber: result.user.mobileNumber,
          role: result.user.role
        });
        
        status().catch(err => console.error("Failed to update status:", err));
        
        userType === 'client' ? navigate('/') : navigate('/admin/dashboard');

      } else {
        setError(result.message || 'An unknown error occurred.');
      }
    } catch (error) {
      console.error('Login submit error:', error);
      setError('Login failed. Please try again.');
    }
  };

  return (
    <>
      <div className='min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center px-4 sm:px-6 lg:px-8'>
        <div className='w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12'>
          {/* Left Side - Welcome Section */}
          <div className='hidden lg:flex flex-col justify-center items-start max-w-md animate-slideInLeft'>
            <div className='mb-8'>
              <h1 className='text-5xl font-bold text-gray-900 mb-4'>
                Welcome to <span className='gradient-text'>Flyhigh</span>
              </h1>
              <p className='text-xl text-gray-600 leading-relaxed'>
                Your journey begins here. Book flights, manage reservations, and explore the world with confidence.
              </p>
            </div>
            <div className='space-y-4'>
              <div className='flex items-center gap-3 group'>
                <div className='w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center animate-pulse-slow'>
                  <svg className='w-6 h-6 text-purple-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8'></path>
                  </svg>
                </div>
                <div>
                  <h3 className='font-semibold text-gray-900'>Fast & Easy Booking</h3>
                  <p className='text-sm text-gray-600'>Book your flights in minutes</p>
                </div>
              </div>
              <div className='flex items-center gap-3 group'>
                <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center animate-pulse-slow' style={{animationDelay: '0.5s'}}>
                  <svg className='w-6 h-6 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'></path>
                  </svg>
                </div>
                <div>
                  <h3 className='font-semibold text-gray-900'>Secure & Reliable</h3>
                  <p className='text-sm text-gray-600'>Your data is safe with us</p>
                </div>
              </div>
              <div className='flex items-center gap-3 group'>
                <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center animate-pulse-slow' style={{animationDelay: '1s'}}>
                  <svg className='w-6 h-6 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9'></path>
                  </svg>
                </div>
                <div>
                  <h3 className='font-semibold text-gray-900'>Global Coverage</h3>
                  <p className='text-sm text-gray-600'>Fly anywhere in the world</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className='w-full max-w-md animate-slideInRight'>
            <div className='bg-white rounded-2xl shadow-xl p-8 card-hover'>
              <div className='text-center mb-8'>
                <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full mb-4 animate-float'>
                  <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'></path>
                  </svg>
                </div>
                <h2 className='text-2xl font-bold text-gray-900'>Sign in to your account</h2>
                <p className='text-gray-600 mt-2'>Welcome back! Please enter your details.</p>
              </div>

              {error && (
                <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-shake'>
                  <div className='flex items-center'>
                    <svg className='w-5 h-5 text-red-600 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'></path>
                    </svg>
                    <p className='text-red-800 text-sm'>{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className='space-y-6'>
                {/* User Type Selection */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-3'>Login as</label>
                  <div className='grid grid-cols-2 gap-3'>
                    <label className={`relative flex items-center justify-center px-4 py-3 border rounded-lg cursor-pointer transition-all ${
                      userType === 'client' 
                        ? 'border-purple-600 bg-purple-50 text-purple-600' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}>
                      <input
                        type='radio'
                        name='userType'
                        value='client'
                        checked={userType === 'client'}
                        onChange={(e) => setUserType(e.target.value)}
                        className='sr-only'
                      />
                      <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'></path>
                      </svg>
                      <span className='font-medium'>Customer</span>
                    </label>
                    <label className={`relative flex items-center justify-center px-4 py-3 border rounded-lg cursor-pointer transition-all ${
                      userType === 'admin' 
                        ? 'border-purple-600 bg-purple-50 text-purple-600' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}>
                      <input
                        type='radio'
                        name='userType'
                        value='admin'
                        checked={userType === 'admin'}
                        onChange={(e) => setUserType(e.target.value)}
                        className='sr-only'
                      />
                      <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'></path>
                      </svg>
                      <span className='font-medium'>Admin</span>
                    </label>
                  </div>
                  <p className='text-xs text-gray-500 mt-2 text-center'>Choose your account type to access the appropriate dashboard</p>
                </div>

                {/* Email Input */}
                <div>
                  <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-2'>
                    Email address
                  </label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                      <svg className='h-5 w-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'></path>
                      </svg>
                    </div>
                    <input
                      id='email'
                      name='email'
                      type='email'
                      autoComplete='email'
                      required
                      value={email}
                onChange={(e) => setEmail(e.target.value)}
                      className='block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all'
                      placeholder='you@example.com'
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-2'>
                    Password
                  </label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                      <svg className='h-5 w-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'></path>
                      </svg>
                    </div>
                    <input
                      id='password'
                      name='password'
                      type={showPassword ? 'text' : 'password'}
                      autoComplete='current-password'
                required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className='block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all'
                      placeholder='••••••••'
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className='absolute inset-y-0 right-0 pr-3 flex items-center'
                    >
                      <svg className='h-5 w-5 text-gray-400 hover:text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        {showPassword ? (
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21' />
                        ) : (
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                        )}
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className='flex items-center justify-between'>
                  <div className='flex items-center'>
                    <input
                      id='remember-me'
                      name='remember-me'
                      type='checkbox'
                      className='h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded'
                    />
                    <label htmlFor='remember-me' className='ml-2 block text-sm text-gray-700'>
                      Remember me
                    </label>
                  </div>
                  <Link
                    to='/forgot-password'
                    className='text-sm text-purple-600 hover:text-purple-700 font-medium'
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type='submit'
                  className='w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transform transition-all hover:scale-[1.02]'
                >
                  Sign in
                </button>

                {/* Divider */}
                <div className='relative'>
                  <div className='absolute inset-0 flex items-center'>
                    <div className='w-full border-t border-gray-300'></div>
                  </div>
                  <div className='relative flex justify-center text-sm'>
                    <span className='px-2 bg-white text-gray-500'>New to Flyhigh?</span>
          </div>
        </div>

                {/* Register Link */}
                <div className='text-center'>
                  <Link
                    to='/register'
                    className='w-full inline-flex justify-center py-3 px-4 border border-purple-600 rounded-lg shadow-sm text-sm font-medium text-purple-600 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all'
                  >
                    Create an account
                  </Link>
                </div>
              </form>
        </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MainBody;
