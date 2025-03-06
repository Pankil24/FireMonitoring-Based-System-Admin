import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Route, Routes, useNavigate } from 'react-router-dom'
import './App.css'
import Header from './Components/Header'
import Dashboard from './Pages/Dashboard'
import Login from './Pages/Login'
import Notification from './Pages/Notification'
import PendingRequests from './Pages/PendingRequests'
import UserDetails from './Pages/UserDetails'
import { Bounce, ToastContainer } from 'react-toastify'
import GoogleMapsComponent from './Components/GoogleMapsComponent'

function App() {
  const userData = useSelector((state) => state?.user)
  const toast = useSelector((state) => state?.toast)
  const navigate = useNavigate()
  // console.log('User Data ==>', userData)

  useEffect(() => {
    if (!userData?.userInfo) {
      navigate('/sign-up')
    }
  }, [])
  return (
    <div className='app-container'>
      {toast?.show && (
        <ToastContainer
          position='top-right'
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick={false}
          rtl={false}
          draggable
          pauseOnHover={false}
          theme={'dark'}
          transition={Bounce}
        />
      )}
      {/* Sidebar (Header) */}
      {userData?.userInfo && <Header />}

      {/* Main Content Area */}
      <div className='content'>
        <Routes>
          {userData?.userInfo && (
            <React.Fragment>
              <Route path='/' element={<Dashboard />} />
              <Route path='/request-approval' element={<PendingRequests />} />
              <Route path='/notifications' element={<Notification />} />
              <Route path='/user-details' element={<UserDetails />} />
              <Route path='/google-maps' element={<GoogleMapsComponent />} />
            </React.Fragment>
          )}
          <Route path='/sign-up' element={<Login />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
