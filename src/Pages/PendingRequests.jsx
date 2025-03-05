import React, { useEffect, useState } from 'react'
import axiosHandler from '../lib/axiosInterceptor'

const PendingRequests = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [data, setData] = useState()

  const mockRequests = [
    {
      id: 1,
      requestNo: 'NOC-2024-001',
      applicantName: 'John Doe',
      propertyType: 'Commercial',
      submissionDate: '2024-01-15',
      status: 'Pending'
    },
    {
      id: 2,
      requestNo: 'NOC-2024-002',
      applicantName: 'Jane Smith',
      propertyType: 'Residential',
      submissionDate: '2024-01-16',
      status: 'Pending'
    }
  ]

  const handleView = (request) => {
    setSelectedRequest(request)
    setIsModalVisible(true)
  }

  const handleApprove = (request) => {
    console.log('Approving request:', request)
  }

  const handleReject = (request) => {
    console.log('Rejecting request:', request)
  }

  const filteredData = mockRequests.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  )

  const lastItemIndex = currentPage * itemsPerPage
  const firstItemIndex = lastItemIndex - itemsPerPage
  const currentItems = filteredData.slice(firstItemIndex, lastItemIndex)

  console.log('Currnt Items ==>', currentItems)

  const fetchPendingRequests = async () => {
    try {
      const response = await axiosHandler.get('user/pendingNoc')

      console.log('Response ==>', response)
      if (response?.data?.code === 200) {
        setData(response?.data?.data)
      }
    } catch (error) {
      console.log('error:', error)
    }
  }

  useEffect(() => {
    fetchPendingRequests()
  }, [])

  return (
    <div className='p-6 bg-gray-900 text-gray-200 h-full min-h-screen  shadow-lg'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold text-white'>NOC Requests</h1>
        <div className='relative'>
          <input
            type='text'
            placeholder='Search requests...'
            className='px-4 py-2 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500'
            onChange={(e) => setSearchText(e.target.value)}
          />
          <span className='absolute right-3 top-2.5 text-gray-400'>🔍</span>
        </div>
      </div>

      <div className='overflow-x-auto'>
        <table className='min-w-full bg-gray-800 text-gray-200 rounded-lg overflow-hidden'>
          <thead className='bg-gray-700'>
            <tr>
              {[
                'Request No',
                'Applicant Name',
                'Property Type',
                'Submission Date',
                'Status',
                'Actions'
              ].map((header) => (
                <th
                  key={header}
                  className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase'
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-700'>
            {currentItems.map((request) => (
              <tr
                key={request.id}
                className='hover:bg-gray-700 transition-colors duration-150'
              >
                <td className='px-6 py-4 whitespace-nowrap'>
                  {request.requestNo}
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  {request.applicantName}
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  {request.propertyType}
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  {request.submissionDate}
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <span className='px-2 py-1 text-xs rounded-full bg-gray-600 text-gray-300'>
                    {request.status}
                  </span>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='flex space-x-2'>
                    <button
                      onClick={() => handleView(request)}
                      className='px-3 py-1 text-gray-400 hover:text-white'
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleApprove(request)}
                      className='px-3 py-1 text-green-400 hover:text-green-300'
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(request)}
                      className='px-3 py-1 text-red-400 hover:text-red-300'
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='mt-4 flex justify-between items-center'>
        <div className='text-sm text-gray-400'>
          Showing {firstItemIndex + 1} to{' '}
          {Math.min(lastItemIndex, filteredData.length)} of{' '}
          {filteredData.length} entries
        </div>
        <div className='flex space-x-2'>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className='px-3 py-1 border border-gray-600 rounded-md disabled:opacity-50 hover:bg-gray-700 text-gray-300'
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={lastItemIndex >= filteredData.length}
            className='px-3 py-1 border border-gray-600 rounded-md disabled:opacity-50 hover:bg-gray-700 text-gray-300'
          >
            Next
          </button>
        </div>
      </div>

      {isModalVisible && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm'>
          <div className='bg-gray-800 rounded-lg p-6 max-w-2xl w-full shadow-xl text-gray-200'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-xl font-bold text-white'>
                NOC Request Details
              </h2>
              <button
                onClick={() => setIsModalVisible(false)}
                className='text-gray-400 hover:text-white'
              >
                ✕
              </button>
            </div>
            {selectedRequest && (
              <div className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  {[
                    'Request No',
                    'Applicant Name',
                    'Property Type',
                    'Submission Date'
                  ].map((field, index) => (
                    <div key={index} className='p-3 bg-gray-700 rounded-lg'>
                      <p className='text-gray-400'>{field}:</p>
                      <p className='font-medium text-white'>
                        {selectedRequest[field.toLowerCase().replace(/ /g, '')]}
                      </p>
                    </div>
                  ))}
                </div>
                <div className='mt-6'>
                  <h4 className='text-lg font-semibold mb-3 text-gray-300'>
                    Documents
                  </h4>
                  <p className='text-gray-500'>No documents available</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default PendingRequests
