import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiCall } from '../utils/api';

const UserProfile = ({ setUser }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state || {};
  
  const [userProfile, setUserProfile] = useState({
    title: '',
    firstName: '',
    lastName: '',
    email: '',
    birthday: '',
    gender: '',
    maritalStatus: '',
    address: '',
    mobileNumber: '',
    profileImage: ''
  });

  const [profileImage, setProfileImage] = useState(null);
  const [completion, setCompletion] = useState(0);
  const [editingProfile, setEditingProfile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    if (data.userData) {
      const updatedProfile = {
        ...userProfile,
        title: data.userData.title || '',
        firstName: data.userData.firstName || '',
        lastName: data.userData.lastName || '',
        email: data.userData.email || '',
        mobileNumber: data.userData.mobileNumber || '',
      };
      setUserProfile(updatedProfile);
      calculateCompletion(updatedProfile);
    }
  }, []);

    const fetchProfile = async () => {
      try {
      const response = await fetch('http://localhost:3000/api/users');
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const Data = await response.json();
        const filterdata = Data.filter(profile =>
          profile.email === data.userData.email
      );
      
        if (filterdata[0]) {
          const updatedProfile = {
            title: filterdata[0].title || '',
            firstName: filterdata[0].firstName || '',
            lastName: filterdata[0].lastName || '',
            email: filterdata[0].email || '',
            mobileNumber: filterdata[0].mobileNumber || '',
            birthday: filterdata[0].birthday || '',
            gender: filterdata[0].gender || '',
            maritalStatus: filterdata[0].maritalStatus || '',
            address: filterdata[0].address || '',
          profileImage: filterdata[0].profileImage || '',
          };
          setUserProfile(updatedProfile);
        setProfileImage(filterdata[0].profileImage || null);
          calculateCompletion(updatedProfile);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    
  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedProfile = {
      ...userProfile,
      [name]: value,
    };
    setUserProfile(updatedProfile);
    calculateCompletion(updatedProfile);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        setUserProfile(prev => ({
          ...prev,
          profileImage: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateCompletion = (profile) => {
    const fields = Object.values(profile).filter(key => key !== 'profileImage');
    const completedFields = fields.filter((field) => field !== '');
    setCompletion(Math.round((completedFields.length / fields.length) * 100));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    setPasswordError('');
    
    if (name === 'newPassword') {
      let strength = 0;
      if (value.length >= 8) strength++;
      if (value.match(/[a-z]/) && value.match(/[A-Z]/)) strength++;
      if (value.match(/[0-9]/)) strength++;
      if (value.match(/[^a-zA-Z0-9]/)) strength++;
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

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    const { allMet } = validatePassword(passwordData.newPassword);
    if (!allMet) {
      setPasswordError('Password does not meet all requirements');
      return;
    }

    try {
      const response = await apiCall('/api/change-password', {
        method: 'POST',
        body: JSON.stringify({
          email: userProfile.email,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      if (response.success) {
        setSuccessMessage('Password changed successfully!');
        setShowSuccess(true);
        setShowPasswordModal(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setPasswordStrength(0);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        setPasswordError(response.message || 'Failed to change password');
      }
    } catch (error) {
      setPasswordError('Error changing password. Please try again.');
    }
  };

  const saveProfile = async () => {
    setIsSaving(true);
    try {
      const response = await apiCall('/api/update-profile', {
        method: 'POST',
        body: JSON.stringify({
          email: userProfile.email,
          updatedProfile: { ...userProfile, profileImage: profileImage },
        }),
      });
      
      if (response.message === 'Profile updated successfully') {
        setEditingProfile(false);
        setSuccessMessage('Profile updated successfully!');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        
        // Update local state to reflect saved changes
        const updatedProfile = { ...userProfile, profileImage: profileImage };
        setUserProfile(updatedProfile);
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert(`Error updating profile: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    window.location.href = '/';
  };

      return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-slideInRight z-50">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {successMessage}
        </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Profile Card & Actions */}
          <div className="lg:col-span-1">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden min-h-[600px]">
              {/* Gradient header matching login page */}
              <div className="h-32 bg-gradient-to-r from-purple-600 to-blue-600"></div>
              
              <div className="px-8 pb-8 -mt-16">
                {/* Profile Image */}
        <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <div className="w-32 h-32 rounded-full bg-white p-1 shadow-lg">
                      <div className="w-full h-full rounded-full bg-gradient-to-r from-purple-600 to-blue-600 p-0.5">
                        <div className="w-full h-full rounded-full bg-white p-0.5">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                              className="w-full h-full rounded-full object-cover"
              />
            ) : (
                            <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
                              <svg className="w-14 h-14 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                              </svg>
                            </div>
            )}
                        </div>
                      </div>
                    </div>
                    {editingProfile && (
                      <label className="absolute -bottom-1 -right-1 bg-purple-600 text-white p-2.5 rounded-full cursor-pointer hover:bg-purple-700 transition-colors shadow-md">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>
                </div>

                {/* User Info */}
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    {userProfile.firstName} {userProfile.lastName}
                  </h2>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-center text-gray-600 text-sm">
                      <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                      <span className="truncate max-w-[220px]">{userProfile.email}</span>
                    </div>
                    
                    {userProfile.mobileNumber && (
                      <div className="flex items-center justify-center text-gray-600 text-sm">
                        <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                        </svg>
                        <span>{userProfile.mobileNumber}</span>
                      </div>
                    )}
                  </div>
        </div>

                {/* Profile Completion */}
                <div className="mb-7 px-3">
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-200">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-gray-700">Profile Completion</span>
                      <span className="text-sm font-bold text-purple-600">{completion}%</span>
      </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${completion}%` }}
              ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-3 text-center">
                      {completion < 50 ? 'Add more details' : completion < 80 ? 'Almost complete!' : 'Profile complete!'}
                    </p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-3 px-3">
                  <button
                    onClick={() => navigate('/myflts', { state: { email: userProfile.email } })}
                    className="w-full bg-white border-2 border-purple-600 text-purple-600 py-3.5 px-4 rounded-xl font-medium hover:bg-purple-50 transition-all duration-200 flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                    </svg>
                    My Bookings
                  </button>

                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="w-full bg-white border-2 border-purple-600 text-purple-600 py-3.5 px-4 rounded-xl font-medium hover:bg-purple-50 transition-all duration-200 flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                    Change Password
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3.5 px-4 rounded-xl font-medium hover:from-rose-600 hover:to-pink-600 transition-all duration-200 flex items-center justify-center shadow-md"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Personal Information Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              {/* Header with Edit Button */}
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Personal Information</h1>
                  <p className="text-gray-600">Manage your personal details and preferences</p>
        </div>
        {!editingProfile && (
            <button
                    onClick={() => setEditingProfile(true)}
                    className="px-6 py-3 rounded-xl font-medium transition-all transform hover:scale-[1.02] flex items-center bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    Edit Profile
            </button>
          )}
              </div>

                              {editingProfile && (
                  <div className="mb-6 p-4 bg-purple-50 border border-[#8b1c64] border-opacity-30 rounded-xl">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-[#8b1c64] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <p className="text-sm text-[#8b1c64]">You are now editing your profile. Click "Save Changes" when done or "Cancel" to discard changes.</p>
                    </div>
                  </div>
                )}

              {/* Personal Information Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information Section */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-[#8b1c64]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                    </div>
                    Basic Information
                  </h3>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <select
                    name="title"
                    value={userProfile.title}
                    onChange={handleChange}
                    disabled={!editingProfile}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8b1c64] focus:border-transparent transition-all disabled:bg-gray-50 disabled:text-gray-500"
                  >
                    <option value="">Select Title</option>
                    <option value="Mr.">Mr.</option>
                    <option value="Ms.">Ms.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Dr.">Dr.</option>
                  </select>
                </div>

                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={userProfile.firstName}
                    onChange={handleChange}
                    disabled={!editingProfile}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8b1c64] focus:border-transparent transition-all disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="Enter first name"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={userProfile.lastName}
                    onChange={handleChange}
                    disabled={!editingProfile}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8b1c64] focus:border-transparent transition-all disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="Enter last name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={userProfile.email}
                      disabled={true}
                      className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl bg-gray-50 text-gray-500"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Contact Information Section */}
                <div className="md:col-span-2 mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-[#8b1c64]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                      </svg>
                    </div>
                    Contact & Personal Details
                  </h3>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="mobileNumber"
                      value={userProfile.mobileNumber}
                      onChange={handleChange}
                      disabled={!editingProfile}
                      className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8b1c64] focus:border-transparent transition-all disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder="Enter phone number"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Birthday */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Birthday</label>
                  <input
                    type="date"
                    name="birthday"
                    value={userProfile.birthday}
                    onChange={handleChange}
                    disabled={!editingProfile}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8b1c64] focus:border-transparent transition-all disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select
                    name="gender"
                    value={userProfile.gender}
                    onChange={handleChange}
                    disabled={!editingProfile}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8b1c64] focus:border-transparent transition-all disabled:bg-gray-50 disabled:text-gray-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>

                {/* Marital Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status</label>
                  <select
                    name="maritalStatus"
                    value={userProfile.maritalStatus}
                    onChange={handleChange}
                    disabled={!editingProfile}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8b1c64] focus:border-transparent transition-all disabled:bg-gray-50 disabled:text-gray-500"
                  >
                    <option value="">Select Status</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                  </select>
                </div>
              </div>

              {/* Address */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea
                  name="address"
                  value={userProfile.address}
                  onChange={handleChange}
                  disabled={!editingProfile}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8b1c64] focus:border-transparent transition-all disabled:bg-gray-50 disabled:text-gray-500 resize-none"
                  placeholder="Enter your address"
                ></textarea>
              </div>

              {/* Action Buttons for Edit Mode */}
          {editingProfile && (
                <div className="mt-8 flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setEditingProfile(false);
                      // Reset to original values
                      fetchProfile();
                    }}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-all"
                  >
                    Cancel
                  </button>
            <button
              onClick={saveProfile}
                    disabled={isSaving}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isSaving ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </span>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Save Changes
                      </>
                    )}
            </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full animate-slideInUp">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Change Password</h3>
            
            <form onSubmit={handlePasswordSubmit}>
              {/* Current Password */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b1c64] focus:border-transparent"
                  required
                />
              </div>

              {/* New Password */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b1c64] focus:border-transparent"
                  required
                />
                
                {/* Password Strength Indicator */}
                {passwordData.newPassword && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-2 flex-1 rounded-full transition-all ${
                            passwordStrength >= level
                              ? level <= 2
                                ? 'bg-red-500'
                                : level === 3
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                              : 'bg-gray-200'
                          }`}
                        ></div>
                      ))}
                    </div>
                    <p className={`text-xs ${
                      passwordStrength <= 2 ? 'text-red-600' :
                      passwordStrength === 3 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {passwordStrength <= 1 ? 'Weak' :
                       passwordStrength === 2 ? 'Fair' :
                       passwordStrength === 3 ? 'Good' : 'Strong'} password
                    </p>
                  </div>
                )}

                {/* Password Requirements */}
                <div className="mt-3 text-xs text-gray-600">
                  <p className="font-medium mb-1">Password must contain:</p>
                  <ul className="space-y-1">
                    <li className={`flex items-center ${passwordData.newPassword.length >= 8 ? 'text-green-600' : ''}`}>
                      <svg className={`w-4 h-4 mr-1 ${passwordData.newPassword.length >= 8 ? 'text-green-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      At least 8 characters
                    </li>
                    <li className={`flex items-center ${/[A-Z]/.test(passwordData.newPassword) && /[a-z]/.test(passwordData.newPassword) ? 'text-green-600' : ''}`}>
                      <svg className={`w-4 h-4 mr-1 ${/[A-Z]/.test(passwordData.newPassword) && /[a-z]/.test(passwordData.newPassword) ? 'text-green-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Upper and lowercase letters
                    </li>
                    <li className={`flex items-center ${/[0-9]/.test(passwordData.newPassword) ? 'text-green-600' : ''}`}>
                      <svg className={`w-4 h-4 mr-1 ${/[0-9]/.test(passwordData.newPassword) ? 'text-green-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      At least one number
                    </li>
                    <li className={`flex items-center ${/[!@#$%^&*(),.?":{}|<>]/.test(passwordData.newPassword) ? 'text-green-600' : ''}`}>
                      <svg className={`w-4 h-4 mr-1 ${/[!@#$%^&*(),.?":{}|<>]/.test(passwordData.newPassword) ? 'text-green-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      At least one special character
                    </li>
                  </ul>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b1c64] focus:border-transparent"
                  required
                />
              </div>

              {/* Error Message */}
              {passwordError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                  {passwordError}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
            <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-[1.02]"
            >
                  Change Password
            </button>
            <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    setPasswordError('');
                    setPasswordStrength(0);
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-all"
            >
                  Cancel
            </button>
              </div>
        </form>
      </div>
        </div>
      )}

      {/* Add custom styles for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideInRight {
          from { 
            opacity: 0;
            transform: translateX(30px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInUp {
          from { 
            opacity: 0;
            transform: translateY(30px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }
        
        .animate-slideInUp {
          animation: slideInUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default UserProfile;