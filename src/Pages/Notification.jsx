import React, { useState, useEffect } from 'react'
import { MdNotificationsActive, MdNotificationsNone } from 'react-icons/md'
import { Link, useLocation } from 'react-router-dom'
import axiosHandler from '../lib/axiosInterceptor'

const Notification = () => {
  const [notifications, setNotifications] = useState([])

  const getNotifications = async () => {
    const response = await axiosHandler.get('/notifications')

    if (response?.status === 200) {
      setNotifications(response?.data)
    }
  }

  console.log('notifications ==>', notifications)

  // useEffect(() => {
  //   // Mock notifications data
  //   const mockNotifications = [
  //     {
  //       id: 1,
  //       title: 'New User Registration',
  //       description: 'John Doe has registered as a new user',
  //       timestamp: '2024-01-20T10:30:00',
  //       isRead: false
  //     },
  //     {
  //       id: 2,
  //       title: 'System Update',
  //       description: 'System maintenance scheduled for tomorrow',
  //       timestamp: '2024-01-19T15:45:00',
  //       isRead: true
  //     }
  //   ]
  //   setNotifications(mockNotifications)
  // }, [])

  useEffect(() => {
    getNotifications()
  }, [])

  return (
    <div className='bg-black text-white min-h-screen p-6'>
      <h2 className='text-2xl font-bold mb-6'>Notifications</h2>
      <div className='space-y-4'>
        {notifications.map((notification) => (
          <Link to={notification?.path}>
            <div
              key={notification.id}
              className={`p-4 rounded-lg shadow-md border border-gray-700 ${
                notification.isRead ? 'bg-gray-900' : 'bg-gray-800'
              } hover:bg-gray-700 transition-all`}
            >
              <div className='flex items-start justify-between'>
                <div className='flex items-start space-x-3'>
                  {notification.isRead ? (
                    <MdNotificationsNone className='h-6 w-6 text-gray-400' />
                  ) : (
                    <MdNotificationsActive className='h-6 w-6 text-yellow-400' />
                  )}
                  <div>
                    <h3 className='font-semibold text-white'>
                      {notification.title}
                    </h3>
                    <p className='text-gray-400 mt-1'>
                      {notification.description}
                    </p>
                    <span className='text-sm text-gray-500'>
                      {new Date(notification.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
                {!notification.isRead && (
                  <button
                    onClick={() => {
                      setNotifications((prevNotifications) =>
                        prevNotifications.map((n) =>
                          n.id === notification.id ? { ...n, isRead: true } : n
                        )
                      )
                    }}
                    className='text-sm text-yellow-400 hover:text-yellow-300'
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Notification
