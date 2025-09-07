import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import NavbarL from '../components/NavbarL';
import { verifyResetToken, resetPassword } from '../utils/api';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userType = searchParams.get('userType') || 'client';

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [tokenValid, setTokenValid] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await verifyResetToken(token, userType);
        
        if (response.success) {
          setTokenValid(true);
          setUserEmail(response.email);
        } else {
          setError(response.message);
          setTokenValid(false);
        }
      } catch (error) {
        console.error('Token verification error:', error);
        setError('Invalid or expired reset link.');
        setTokenValid(false);
      } finally {
        setVerifying(false);
      }
    };

    if (token) {
      verifyToken();
    } else {
      setError('Invalid reset link.');
      setVerifying(false);
    }
  }, [token, userType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'newPassword') {
        const { requirements } = validatePassword(value);
        let strength = 0;
        if (requirements.minLength) strength++;
        if (requirements.hasUpperCase && requirements.hasLowerCase) strength++;
        if (requirements.hasNumber) strength++;
        if (requirements.hasSpecialChar) strength++;
        setPasswordStrength(strength);
    }
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
    setLoading(true);
    setError('');
    setMessage('');

    const { allMet: passwordIsValid } = validatePassword(formData.newPassword);
    if (!passwordIsValid) {
      setError('Password does not meet all requirements.');
      setLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const response = await resetPassword(token, formData.newPassword, userType);
      
      if (response.success) {
        setMessage(response.message);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(response.message);
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <>
        <NavbarL />
        <div className="content flex flex-col pt-[100px] h-[89.2vh] justify-center bg-red-300">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md mx-auto">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8b1c64] mx-auto mb-4"></div>
            <p className="text-gray-600">Verifying reset link...</p>
          </div>
        </div>
      </>
    );
  }

  if (!tokenValid) {
    return (
      <>
        <NavbarL />
        <div className="content flex flex-col pt-[100px] h-[89.2vh] justify-center bg-red-300 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Invalid Reset Link</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <div className="space-y-3">
                <Link
                  to="/forgot-password"
                  className="block w-full bg-[#8b1c64] hover:bg-[#4c0c36] text-white font-medium py-3 px-4 rounded-lg transition duration-150 ease-in-out"
                >
                  Request New Reset Link
                </Link>
                <Link
                  to="/login"
                  className="block w-full text-[#8b1c64] hover:text-[#4c0c36] font-medium py-3 px-4 border border-[#8b1c64] rounded-lg transition duration-150 ease-in-out"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavbarL />
      <div className="content flex flex-col pt-[100px] h-auto min-h-[89.2vh] justify-center bg-red-300 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-[#8b1c64] mb-2">
                Reset Your Password
              </h2>
              <p className="text-gray-600 mb-8">
                Enter your new password for <span className="font-medium">{userEmail}</span>
              </p>
            </div>

            {message && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-sm">{message}</p>
                <p className="text-green-700 text-xs mt-1">Redirecting to login page...</p>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-3 border-2 border-black rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8b1c64] focus:border-[#8b1c64]"
                  placeholder="Enter your new password"
                  disabled={loading || !!message}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-3 border-2 border-black rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8b1c64] focus:border-[#8b1c64]"
                  placeholder="Confirm your new password"
                  disabled={loading || !!message}
                />
              </div>

              {formData.newPassword && (
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
                  <div className='space-y-1'>
                    {(() => {
                      const { requirements } = validatePassword(formData.newPassword);
                      return (
                        <>
                          <p className={`text-xs flex items-center gap-1 ${requirements.minLength ? 'text-green-600' : 'text-gray-400'}`}>
                            At least 8 characters
                          </p>
                          <p className={`text-xs flex items-center gap-1 ${requirements.hasUpperCase && requirements.hasLowerCase ? 'text-green-600' : 'text-gray-400'}`}>
                            Uppercase & lowercase letters
                          </p>
                          <p className={`text-xs flex items-center gap-1 ${requirements.hasNumber ? 'text-green-600' : 'text-gray-400'}`}>
                            At least one number
                          </p>
                          <p className={`text-xs flex items-center gap-1 ${requirements.hasSpecialChar ? 'text-green-600' : 'text-gray-400'}`}>
                            At least one special character
                          </p>
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !!message}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                  loading || message
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#8b1c64] hover:bg-[#4c0c36] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8b1c64]'
                } transition duration-150 ease-in-out`}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
