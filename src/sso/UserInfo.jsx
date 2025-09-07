import React, { useEffect, useState } from 'react'
import AdminMenu from '../components/AdminMenu';
import AdminNav from '../components/AdminNav';

function UserInfo() {
    const [users, setUsers] = useState([]);
    const [userCount, setUserCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    
    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch('https://airline-management-and-booking-syst.vercel.app/api/users');
            if (!response.ok) {
              throw new Error('Failed to fetch users');
            }
            const userData = await response.json();
            setUserCount(userData.length);
            setUsers(userData);
            console.log(userData);
            setLoading(false);
        };
    
        fetchUsers();
        const intervalId = setInterval(fetchUsers, 1000);
        return () => clearInterval(intervalId);
      }, [userCount]);
  return (
    <div className="grid grid-cols-12 min-h-screen min-w-screen">
{/*       <div className="min-h-screen col-span-3 flex flex-col items-center">
        <AdminMenu />
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
      {/* Backdrop when menu is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-30"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
      <div className=" min-h-screen col-span-full p-10 z-10 relative">
        <AdminNav />
        <div className="w-full min-h-[220px] p-4 mt-8 rounded-lg shadow-lg">
          <div className="flex justify-between mb-4">
            <h1 className="text-3xl text-gray-500 font-semibold">Users</h1>
          </div>
          <div>
            <table className="table-auto border-collapse min-w-full">
              <tr className="even:bg-gray-100">
                <th className="border border-slate-600 px-4 py-2">#</th>
                <th className="border border-slate-600 px-4 py-2">NAME</th>
                <th className="border border-slate-600 px-4 py-2">EMAIL</th>
                <th className="border border-slate-600 px-4 py-2">PHONE NO</th>
                <th className="border border-slate-600 px-4 py-2">ADDRESS</th>
                <th className="border border-slate-600 px-4 py-2">DATE OF BIRTH</th>
                <th className="border border-slate-600 px-4 py-2">GENDER</th>
                <th className="border border-slate-600 px-4 py-2">MARITAL STATUS</th>
                <th className="border border-slate-600 px-4 py-2">CURRENT STATUS</th>
              </tr>
                {loading ? (
                    // <img src="/loader.gif" alt="loader" />
                    <tr>
                    <td colSpan="100%">
                      <div className="flex justify-center items-center py-4">
                        <img src="/loader.gif" alt="loader" className="h-20 w-20" />
                      </div>
                    </td>
                  </tr>
                ):(
                    <>
                      {users.map((user, index) => (
                        <tr key={index} className="even:bg-zinc-300">
                            <td className="border border-slate-600 text-center">{index+1}</td>
                            <td className="border border-slate-600 text-center">{user.title} {user.firstName} {user.lastName}</td>
                            <td className="border border-slate-600 text-center">{user.email}</td>
                            <td className="border border-slate-600 text-center">{user.mobileNumber}</td>
                            <td className="border border-slate-600 text-center">{user.address}</td>
                            <td className="border border-slate-600 text-center">{user.birthday}</td>
                            <td className="border border-slate-600 text-center">{user.gender}</td>
                            <td className="border border-slate-600 text-center">{user.maritalStatus}</td>
                            <td className="border border-slate-600 text-center">{user.status ? (
                              <div className="flex justify-center items-center gap-2">
                                <img src="/online.png" alt="" className='h-7 w-7' />
                                <div className='text-green-600 font-bold'>Online</div>
                              </div>
                            ) : (
                              <div className="flex justify-center items-center gap-2">
                                <img src="/offline.png" alt="" className='h-7 w-7'/>
                                <div className='text-red-600 font-bold'>Offline</div>
                              </div>
                            )}</td>
                        </tr>
                      ))}
                    </>
                )}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserInfo
