import React from 'react'
import {
  FaBell,
  FaChartBar,
  FaClipboardList,
  FaFire,
  FaMapMarkedAlt, // ✅ Added Google Maps icon
  FaUsersCog,
  FaSignOutAlt
} from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../Pages/Redux/slice/userSlice'

const FireNOCDashboard = () => {
  const isSidebarOpen = true
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  return (
    <div className='flex min-h-screen'>
      {/* Sidebar */}
      <div
        className={`bg-gray-800 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        } transition-all duration-300 flex flex-col justify-between p-4`}
      >
        {/* Sidebar Header */}
        <div>
          <div className='flex items-center justify-center mb-8'>
            <FaFire className='text-[#FF4500] text-3xl' />
            {isSidebarOpen && (
              <span className='text-white ml-2 text-xl font-bold'>
                Fire NOC
              </span>
            )}
          </div>

          {/* Navigation */}
          <nav>
            {[
              { icon: FaChartBar, label: 'Dashboard', path: '/' },
              {
                icon: FaClipboardList,
                label: 'NOC Requests',
                path: '/request-approval'
              },
              { icon: FaBell, label: 'Notifications', path: '/notifications' },
              { icon: FaUsersCog, label: 'Users', path: '/user-details' },
              {
                icon: FaMapMarkedAlt,
                label: 'Google Maps',
                path: '/google-maps'
              } // ✅ Added Google Maps
            ].map((item, index) => (
              <Link key={index} to={item.path}>
                <div className='flex items-center text-gray-300 hover:text-white hover:bg-gray-700 p-3 rounded-lg cursor-pointer mb-2'>
                  <item.icon className='text-xl' />
                  {isSidebarOpen && <span className='ml-3'>{item.label}</span>}
                </div>
              </Link>
            ))}
          </nav>
        </div>

        {/* Logout Button & Admin Info */}
        <div className='mt-auto'>
          <div className='flex items-center p-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg cursor-pointer'>
            <img
              src='https://acdsinc.org/wp-content/uploads/2015/12/dummy-profile-pic.png'
              alt='Admin'
              className='w-10 h-10 rounded-full border-2 border-gray-600'
            />
            {isSidebarOpen && (
              <span className='ml-3 text-white'>
                {user?.userInfo?.admin?.email?.substring(0, 6)}
              </span>
            )}
          </div>

          <div
            className='flex items-center text-gray-300 hover:text-white hover:bg-gray-700 p-3 rounded-lg cursor-pointer mt-3'
            onClick={() => {
              dispatch(logout())
              navigate('/sign-up')
            }}
          >
            <FaSignOutAlt className='text-xl' />
            {isSidebarOpen && <span className='ml-3'>Log Out</span>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FireNOCDashboard
