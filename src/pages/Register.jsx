import React, { useState } from 'react';
import NavbarL from '../components/NavbarL';
import { useNavigate, Link } from 'react-router-dom';
import Footer from '../components/Footer';
// import './registration.css';

const Register = () => {
  const [formData, setFormData] = useState({
    title: 'Mr.',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobileNumber: ''
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Calculate password strength
    if (name === 'password') {
      const { requirements } = validatePassword(value);
      let strength = 0;
      if (requirements.minLength) strength++;
      if (requirements.hasUpperCase && requirements.hasLowerCase) strength++;
      if (requirements.hasNumber) strength++;
      if (requirements.hasSpecialChar) strength++;
      setPasswordStrength(strength);
    }
  };

  // Validation functions
  const isValidMobile = (number) => {
    const pattern = /^[0-9]{10}$/;
    return pattern.test(number);
  };
  
  const isValidEmail = (email) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  };

  const doPasswordsMatch = () => {
    return formData.password === formData.confirmPassword;
  };

  const validatePassword = (password) => {
    const requirements = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    const allMet = Object.values(requirements).every(req => req === true);
    return { requirements, allMet };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidEmail(formData.email)) {
      alert('Please enter a valid email address.');
      return;
    }

    if (!isValidMobile(formData.mobileNumber)) {
      alert('Please enter a valid mobile number (10 digits).');
      return;
    }

    const { allMet } = validatePassword(formData.password);
    if (!allMet) {
      alert('Password does not meet all requirements. Please check the password requirements below.');
      return;
    }

    if (!doPasswordsMatch()) {
      alert('Passwords do not match.');
      return;
    }

    // console.log(formData);
    // Send data to the backend
    let response = await fetch('http://localhost:3000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
    .then(response => response.json())
    .then(data => {
      if (data.message === 'Email is already taken') {
        alert('Email is already taken.');
      } else {
        alert(data.message || 'Registration successful!');
        setFormData({
          title: 'Mr.',
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
          mobileNumber: ''
        });  // Reset form
        navigate(-1);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Registration failed: ' + error.message);
    });
  };

  return (
    <>
    <NavbarL/>
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-xl p-8 card-hover">
          {/* Header */}
          <div className='text-center mb-8'>
            <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full mb-4 animate-float'>
              <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z'></path>
              </svg>
            </div>
            <h2 className='text-2xl font-bold text-gray-900'>Create your account</h2>
            <p className='text-gray-600 mt-2'>Join <span className='gradient-text font-semibold'>Flyhigh</span> and start your journey today</p>
          </div>

          {/* Progress Indicator */}
          <div className='mb-8'>
            <div className='flex items-center justify-center'>
              <div className='flex items-center'>
                <div className='w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium'>1</div>
                <div className='w-16 h-1 bg-purple-600'></div>
                <div className='w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-sm font-medium'>2</div>
              </div>
            </div>
            <div className='flex justify-center mt-2'>
              <span className='text-sm text-gray-600'>Personal Information</span>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Name Section */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-gray-900'>Personal Details</h3>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div>
                  <label htmlFor='title' className='block text-sm font-medium text-gray-700 mb-2'>Title</label>
                  <select 
                    id='title' 
                    name='title' 
                    value={formData.title} 
                    onChange={handleChange}
                    className='w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                  >
            <option value="Mr.">Mr.</option>
            <option value="Ms.">Ms.</option>
            <option value="Mrs.">Mrs.</option>
            <option value="Dr.">Dr.</option>
          </select>
        </div>
                <div>
                  <label htmlFor='firstName' className='block text-sm font-medium text-gray-700 mb-2'>First Name</label>
                  <input 
                    type='text' 
                    id='firstName'
                    name='firstName' 
                    value={formData.firstName} 
                    onChange={handleChange} 
                    placeholder='John'
                    className='w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                    required
                  />
                </div>
                <div>
                  <label htmlFor='lastName' className='block text-sm font-medium text-gray-700 mb-2'>Last Name</label>
                  <input 
                    type='text' 
                    id='lastName'
                    name='lastName' 
                    value={formData.lastName} 
                    onChange={handleChange} 
                    placeholder='Doe'
                    className='w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                    required
                  />
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-gray-900'>Contact Information</h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-2'>Email Address</label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                      <svg className='h-5 w-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'></path>
                      </svg>
                    </div>
                    <input 
                      type='email' 
                      id='email'
                      name='email' 
                      value={formData.email} 
                      onChange={handleChange} 
                      placeholder='john.doe@example.com'
                      className='w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor='mobileNumber' className='block text-sm font-medium text-gray-700 mb-2'>Mobile Number</label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                      <svg className='h-5 w-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'></path>
                      </svg>
                    </div>
                    <input 
                      type='tel' 
                      id='mobileNumber'
                      name='mobileNumber' 
                      value={formData.mobileNumber} 
                      onChange={handleChange} 
                      placeholder='1234567890'
                      className='w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Password Section */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-gray-900'>Security</h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-2'>Password</label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                      <svg className='h-5 w-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'></path>
                      </svg>
                    </div>
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      id='password'
                      name='password' 
                      value={formData.password} 
                      onChange={handleChange} 
                      placeholder='••••••••'
                      className='w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                      required
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
                  {formData.password && (
                    <div className='mt-2'>
                      <div className='flex gap-1 mb-2'>
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-all ${
                              i < passwordStrength
                                ? passwordStrength === 1 ? 'bg-red-500' 
                                : passwordStrength === 2 ? 'bg-yellow-500'
                                : passwordStrength === 3 ? 'bg-blue-500'
                                : 'bg-green-500'
                                : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <p className={`text-xs mb-2 ${
                        passwordStrength === 1 ? 'text-red-500' 
                        : passwordStrength === 2 ? 'text-yellow-500'
                        : passwordStrength === 3 ? 'text-blue-500'
                        : passwordStrength === 4 ? 'text-green-500'
                        : 'text-gray-500'
                      }`}>
                        {passwordStrength === 0 ? 'Too weak' 
                        : passwordStrength === 1 ? 'Weak'
                        : passwordStrength === 2 ? 'Fair'
                        : passwordStrength === 3 ? 'Good'
                        : 'Strong'}
                      </p>
                      {/* Password Requirements */}
                      <div className='space-y-1'>
                        <p className='text-xs font-medium text-gray-600 mb-1'>Password must contain:</p>
                        {(() => {
                          const { requirements } = validatePassword(formData.password);
                          return (
                            <>
                              <div className={`text-xs flex items-center gap-1 ${requirements.minLength ? 'text-green-600' : 'text-gray-400'}`}>
                                <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                  {requirements.minLength ? (
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 13l4 4L19 7' />
                                  ) : (
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
                                  )}
                                </svg>
                                At least 8 characters
                              </div>
                              <div className={`text-xs flex items-center gap-1 ${requirements.hasUpperCase ? 'text-green-600' : 'text-gray-400'}`}>
                                <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                  {requirements.hasUpperCase ? (
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 13l4 4L19 7' />
                                  ) : (
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
                                  )}
                                </svg>
                                One uppercase letter
                              </div>
                              <div className={`text-xs flex items-center gap-1 ${requirements.hasLowerCase ? 'text-green-600' : 'text-gray-400'}`}>
                                <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                  {requirements.hasLowerCase ? (
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 13l4 4L19 7' />
                                  ) : (
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
                                  )}
                                </svg>
                                One lowercase letter
                              </div>
                              <div className={`text-xs flex items-center gap-1 ${requirements.hasNumber ? 'text-green-600' : 'text-gray-400'}`}>
                                <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                  {requirements.hasNumber ? (
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 13l4 4L19 7' />
                                  ) : (
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
                                  )}
                                </svg>
                                One number
                              </div>
                              <div className={`text-xs flex items-center gap-1 ${requirements.hasSpecialChar ? 'text-green-600' : 'text-gray-400'}`}>
                                <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                  {requirements.hasSpecialChar ? (
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 13l4 4L19 7' />
                                  ) : (
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
                                  )}
                                </svg>
                                One special character (!@#$%^&*...)
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-700 mb-2'>Confirm Password</label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                      <svg className='h-5 w-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'></path>
                      </svg>
                    </div>
                    <input 
                      type={showConfirmPassword ? 'text' : 'password'} 
                      id='confirmPassword'
                      name='confirmPassword' 
                      value={formData.confirmPassword} 
                      onChange={handleChange} 
                      placeholder='••••••••'
                      className='w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                      required
                    />
                    <button
                      type='button'
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className='absolute inset-y-0 right-0 pr-3 flex items-center'
                    >
                      <svg className='h-5 w-5 text-gray-400 hover:text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        {showConfirmPassword ? (
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21' />
                        ) : (
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                        )}
                      </svg>
                    </button>
                  </div>
                  {formData.confirmPassword && formData.password && (
                    <p className={`mt-1 text-xs ${doPasswordsMatch() ? 'text-green-500' : 'text-red-500'}`}>
                      {doPasswordsMatch() ? '✓ Passwords match' : '✗ Passwords do not match'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className='flex items-start'>
              <input
                id='terms'
                name='terms'
                type='checkbox'
                className='h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mt-0.5'
                required
              />
              <label htmlFor='terms' className='ml-2 block text-sm text-gray-700'>
                I agree to the <a href='/terms' className='text-purple-600 hover:text-purple-700 underline'>Terms and Conditions</a> and <a href='/privacy' className='text-purple-600 hover:text-purple-700 underline'>Privacy Policy</a>
              </label>
            </div>

                        {/* Buttons */}
            <div className='flex flex-col sm:flex-row gap-4'>
              <div className='flex-1 relative group'>
                <button 
                  type='submit' 
                  className='w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transform transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
                  disabled={formData.password && !validatePassword(formData.password).allMet}
                >
                  Create Account
                </button>
                {formData.password && !validatePassword(formData.password).allMet && (
                  <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none'>
                    <div className='bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap'>
                      Please meet all password requirements
                    </div>
                    <div className='absolute top-full left-1/2 transform -translate-x-1/2 -mt-1'>
                      <div className='border-4 border-transparent border-t-gray-900'></div>
        </div>
        </div>
                )}
        </div>
              <Link to='/login' className='flex-1'>
                <button 
                  type='button'
                  className='w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all'
                >
                  Back to Login
                </button>
              </Link>
        </div>

            {/* Sign in link */}
            <div className='text-center text-sm text-gray-600'>
              Already have an account? 
              <Link to='/login' className='ml-1 font-medium text-purple-600 hover:text-purple-700'>
                Sign in
              </Link>
        </div>
          </form>
        </div>
        </div>
    </div>
    {/* <Footer/> */}
    </>
  );
}

export default Register;
