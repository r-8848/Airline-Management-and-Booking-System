import { useEffect, useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom'
import { isAuthenticated, getUserFromToken, verifyToken, logout } from './utils/api'
import Login from './pages/Login' 
import Home from './pages/Home'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import FlightList from './pages/FlightList'
import Feedback from './pages/Feedback'
import PassengerForm from './pages/PassengerForm'
import Preview from './pages/Preview'
import Eticket from './pages/Eticket'
import Eticket_ from './pages/Eticket_'
import MyFlights from './pages/MyFlights'
import FlightStatus from './pages/FlightStatus'
import UserProfile from './pages/UserProfile'
import AirlineManagement from './sso/AirlineManagement'
import Bookings from './sso/Bookings'
import Update from './sso/Update'
import Feedbacks from './sso/Feedbacks'
import AddFlight from './sso/AddFlight'
import FlightsManagement from './sso/FlightsManagement'
import Schedule from './sso/Schedule'
import AddAirline from './sso/AddAirline'
import Profile from './sso/Profile'
import AdminDashboard from './sso/AdminDashboard'
import About from './pages/About'
import ViewFlights from './sso/ViewFlights'
import UserInfo from './sso/UserInfo'
import PassInfo from './sso/PassInfo'
import PassList from './sso/PassList'
import EditFlightInfo from './sso/EditFlightInfo'
import ReSchedule from './sso/ReSchedule'
import CancelTicket from './pages/CancelTicket'
import ProtectedRoute from './sso/ProtectedRoute'
import AccessDenied from './sso/AccessDenied'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'

function App() {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      if (isAuthenticated()) {
        try {
          // Verify token with server
          const response = await verifyToken();
          if (response.success) {
            const userData = getUserFromToken();
            if (userData) {
              setUser({
                ...userData,
                mobileNumber: response.user.mobileNumber || ''
              });
              // Update status to online
              await updateUserStatus(1);
            }
          } else {
            // Token is invalid, clear it
            await logout();
            setUser(null);
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          await logout();
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const updateUserStatus = async (status) => {
    if (!user) return;
    try {
              await fetch('http://localhost:3000/api/update-profile-on', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          email: user.email,
          status: status,
        }),
      });
    } catch (error) {
      console.error('Error updating user status:', error);
    }
    };

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (user) {
        updateUserStatus(0);
      }
    };

    const handleLoad = () => {
      if (user) {
        updateUserStatus(1);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('load', handleLoad);

    // Update status to online when user is set
    if (user) {
      updateUserStatus(1);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('load', handleLoad);
    };
  }, [user]);

  const handleSetUser = (userData) => {
    setUser(userData);
    // Token is managed by the API utility functions
    // sessionStorage is replaced with localStorage in the API utils
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
    }

  return (
    <>
      <Router>
      <Routes>
        {/* Client Website Routes */}

        <Route path='/' element={<Home user={user} setUser={handleSetUser}/>}/>
        <Route path='/login' element={<Login user={user} setUser={handleSetUser}/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/forgot-password' element={<ForgotPassword/>}/>
        <Route path='/reset-password/:token' element={<ResetPassword/>}/>
        <Route path='/feedback' element={<Feedback user={user}/>}/>
        <Route path='/passform' element={<PassengerForm user={user}/>}/>
        <Route path='/preview' element={<Preview user={user}/>}/>
        <Route path='/eticket' element={<Eticket user={handleSetUser}/>}/>
        <Route path='/eticket_' element={<Eticket_ user={user}/>}/>
        <Route path="/user" element={<UserProfile user={user} setUser={handleSetUser} />} />
        <Route path='/fltstatus/:originAirport/:destinationAirport/:selectedDate' element={<FlightStatus user={user} setUser={handleSetUser}/>}/>
        <Route path='/fltlist/:originAirport/:destinationAirport/:selectedDate/:passengers' element={<FlightList user={user} setUser={handleSetUser}/>}/>
        <Route path='/myflts' element={<MyFlights user={user}/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/cancel' element={<CancelTicket user={user}/>}/>
        <Route path='/terms' element={<Terms/>}/>
        <Route path='/privacy' element={<Privacy/>}/>

        {/* Admin Portal Routes */}
        <Route path='/admin/access-denied' element={<AccessDenied/>} />

        <Route path='/admin/airlinemanagement' element={<ProtectedRoute><AirlineManagement/></ProtectedRoute>}/>
        <Route path='/admin/bookings' element={<ProtectedRoute><Bookings/></ProtectedRoute>}/>
        <Route path='/admin/scheduleflt' element={<ProtectedRoute><Schedule/></ProtectedRoute>}/>
        <Route path='/admin/viewflt' element={<ProtectedRoute><ViewFlights/></ProtectedRoute>}/>
        <Route path='/admin/feedback' element={<ProtectedRoute><Feedbacks/></ProtectedRoute>}/>
        <Route path='/admin/fltmanagement' element={<ProtectedRoute><FlightsManagement/></ProtectedRoute>}/>
        <Route path='/admin/addflt' element={<ProtectedRoute><AddFlight/></ProtectedRoute>}/>
        <Route path='/admin/scheduled' element={<ProtectedRoute><Update/></ProtectedRoute>}/>
        <Route path='/admin/addairline' element={<ProtectedRoute><AddAirline/></ProtectedRoute>}/>
        <Route path='/admin/profile' element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
        <Route path='/admin/dashboard' element={<ProtectedRoute><AdminDashboard/></ProtectedRoute>}/>
        <Route path='/admin/userinfo' element={<ProtectedRoute><UserInfo/></ProtectedRoute>}/>
        <Route path='/admin/passinfo' element={<ProtectedRoute><PassInfo/></ProtectedRoute>}/>
        <Route path='/admin/passlist' element={<ProtectedRoute><PassList/></ProtectedRoute>}/>
        <Route path='/admin/editfltinfo' element={<ProtectedRoute><EditFlightInfo/></ProtectedRoute>}/>
        <Route path='/admin/reschedule' element={<ProtectedRoute><ReSchedule/></ProtectedRoute>}/>
      </Routes>
      </Router>
    </>
  )
}

export default App;
