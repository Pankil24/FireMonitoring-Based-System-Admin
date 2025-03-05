import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import {
  Route,
  Routes,
  useNavigate
} from 'react-router-dom'
import './App.css'
import Header from './Components/Header'
import Dashboard from './Pages/Dashboard'
import Login from './Pages/Login'
import Notification from './Pages/Notification'
import PendingRequests from './Pages/PendingRequests'
import UserDetails from './Pages/UserDetails'

function App() {
  const userData = useSelector((state) => state?.user)
  const navigate = useNavigate()
  // console.log('User Data ==>', userData)

  useEffect(() => {
    if (!userData?.userInfo) {
      navigate('/sign-up')
    }
  }, [])
  return (
    <div className='app-container'>
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
            </React.Fragment>
          )}
          <Route path='/sign-up' element={<Login />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
