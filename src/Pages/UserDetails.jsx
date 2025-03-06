import React, { useState, useEffect } from 'react'
import { FiSearch, FiFilter } from 'react-icons/fi'
import axiosHandler from '../lib/axiosInterceptor'

const UserDetails = () => {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showUserModal, setShowUserModal] = useState(false)
  const [data, setData] = useState([])

  useEffect(() => {
    // Mock users data
    const mockUsers = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'Admin',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
        joinedDate: '2024-01-01'
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'User',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
        joinedDate: '2024-01-05'
      }
    ]
    setUsers(mockUsers)
  }, [])

  const fetchPendingRequests = async () => {
    try {
      const response = await axiosHandler.get('/api/users')

      console.log('Response ==>', response)
      if (response?.status === 200) {
        setData(response?.data)
      }
    } catch (error) {
      console.log('error:', error)
    }
  }
  console.log('Data ==>', data)

  useEffect(() => {
    fetchPendingRequests()
  }, [])

  const UserList = () => {
    const filteredUsers = users.filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
      <div className='min-h-screen bg-black text-white p-6'>
        <div className='mb-6 flex space-x-4'>
          <div className='flex-1 relative'>
            <FiSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
            <input
              type='text'
              placeholder='Search users...'
              className='w-full bg-gray-800 text-white border-gray-700 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className='flex items-center space-x-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600'>
            <FiFilter />
            <span>Filter</span>
          </button>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {data.map((user) => (
            <div
              key={user.id}
              className='bg-gray-900 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer'
              onClick={() => {
                setSelectedUser(user)
                setShowUserModal(true)
              }}
            >
              <div className='flex items-center space-x-4'>
                <img
                  src={
                    'https://acdsinc.org/wp-content/uploads/2015/12/dummy-profile-pic.png'
                  }
                  alt={user.name}
                  className='w-16 h-16 rounded-full object-cover'
                />
                <div>
                  <h3 className='font-semibold text-white'>{user.name}</h3>
                  <p className='text-gray-400'>{user.email}</p>
                  <span className='text-sm text-gray-500'>{user.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const UserModal = () => {
    if (!selectedUser || !showUserModal) return null

    return (
      <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4'>
        <div className='bg-gray-900 text-white rounded-lg p-6 max-w-md w-full'>
          <div className='flex justify-between items-start mb-4'>
            <h2 className='text-2xl font-semibold'>User Details</h2>
            <button
              onClick={() => setShowUserModal(false)}
              className='text-gray-500 hover:text-gray-400'
            >
              ×
            </button>
          </div>
          <div className='space-y-4 text-center'>
            <img
              src={
                'https://acdsinc.org/wp-content/uploads/2015/12/dummy-profile-pic.png'
              }
              alt={selectedUser.name}
              className='w-32 h-32 rounded-full object-cover mx-auto'
            />
            <h3 className='text-xl font-semibold'>{selectedUser.name}</h3>
            <p className='text-gray-400'>{selectedUser.email}</p>
            <p className='text-gray-500'>{selectedUser.role}</p>
            <p className='text-sm text-gray-500'>
              Joined: {new Date(selectedUser.joinedDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <UserList />
      <UserModal />
    </div>
  )
}

export default UserDetails
