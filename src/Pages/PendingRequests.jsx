import React, { useEffect, useState } from 'react'
import axiosHandler from '../lib/axiosInterceptor'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useLocation, useNavigate } from 'react-router-dom'

const PendingRequests = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [data, setData] = useState([]) // ✅ Fixed initialization
  const location = useLocation()
  const navigate = useNavigate()

  const handleView = (request) => {
    console.log('request =>', request)
    setSelectedRequest(request)
    setIsModalVisible(true)
  }

  const fetchPendingRequests = async (fromData = 'initial') => {
    try {
      const response = await axiosHandler.get('/noc/admin/noc-forms')
      if (response?.status === 200) {
        setData(response?.data?.data || [])

        if (location?.hash && fromData === 'initial') {
          handleView(
            response?.data?.data?.find(
              ({ id }) => id === parseInt(location?.hash?.replace('#', ''))
            )
          )
        }
      }
    } catch (error) {
      console.error('Error fetching requests:', error)
    }
  }

  useEffect(() => {
    fetchPendingRequests()
  }, [])

  // ✅ Apply filtering to actual API data
  const filteredData = data.filter(
    (item) =>
      item.id.toString().includes(searchText) ||
      item.ownerName.toLowerCase().includes(searchText.toLowerCase())
  )

  const lastItemIndex = currentPage * itemsPerPage
  const firstItemIndex = lastItemIndex - itemsPerPage
  const currentItems = filteredData.slice(firstItemIndex, lastItemIndex)

  // Validation Schema
  const validationSchema = Yup.object({
    status: Yup.string().required('Status is required')
    // remarks: Yup.string().when('status', {
    //   is: 'Rejected',
    //   then: Yup.string().required('Remarks are required when rejecting')
    // })
  })

  const handleSubmit = async (values) => {
    console.log('Form submitted:', values)
    values = {
      ...values,
      status: values?.status?.toLowerCase()
    }
    const response = await axiosHandler.put(
      `/api/admin/noc-forms/${values?.id}/status`,
      values
    )
    if (response?.status === 200) {
      setIsModalVisible(false)
      navigate('/request-approval')

      const prepareNofications = {
        title: 'Fire NOC Updated',
        description: 'Fire NOC Status was updated by the admin',
        isRead: false,
        path: `/request-approval#${values?.id}`
      }

      console.log('Preparee ==>', prepareNofications)

      const sentNotitication = axiosHandler.post(
        '/notifications',
        prepareNofications
      )

      fetchPendingRequests('submitData')
    }
  }

  console.log('Data =>', data)

  return (
    <div className='p-6 bg-gray-900 text-gray-200 h-full min-h-screen shadow-lg'>
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
                <td className='px-6 py-4 whitespace-nowrap'>{request.id}</td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  {request.ownerName}
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  {new Date(request.createdAt).toLocaleDateString()}
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <span className='px-2 py-1 text-xs rounded-full bg-gray-600 text-gray-300'>
                    {request.status}
                  </span>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='flex space-x-2'>
                    <button
                      onClick={() => {
                        navigate(`/request-approval#${request?.id}`)
                        handleView(request)
                      }}
                      className='px-3 py-1 text-gray-400 hover:text-white'
                    >
                      View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Pagination */}
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

      {/* ✅ Modal for Request Details */}
      {isModalVisible && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm'>
          <div className='bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full flex flex-col'>
            {/* Modal Header */}
            <div className='p-4 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-gray-800 z-10'>
              <h2 className='text-xl font-bold text-white'>
                NOC Request Details
              </h2>
              <button
                onClick={() => {
                  setIsModalVisible(false)
                  navigate('/request-approval')
                }}
                className='text-gray-400 hover:text-white text-xl'
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className='p-6 overflow-y-auto max-h-[80vh] space-y-4'>
              {selectedRequest && (
                <>
                  {/* Request Details */}
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='p-3 bg-gray-700 rounded-lg'>
                      <p className='text-gray-400'>Request No:</p>
                      <p className='font-medium text-white'>
                        {selectedRequest.id}
                      </p>
                    </div>
                    <div className='p-3 bg-gray-700 rounded-lg'>
                      <p className='text-gray-400'>Applicant Name:</p>
                      <p className='font-medium text-white'>
                        {selectedRequest.ownerName}
                      </p>
                    </div>
                  </div>

                  {/* Business Name */}
                  <div className='p-3 bg-gray-700 rounded-lg'>
                    <p className='text-gray-400'>Business Name:</p>
                    <p className='font-medium text-white'>
                      {selectedRequest.businessName}
                    </p>
                  </div>

                  {/* Contact Number */}
                  <div className='p-3 bg-gray-700 rounded-lg'>
                    <p className='text-gray-400'>Contact Number:</p>
                    <p className='font-medium text-white'>
                      {selectedRequest.contactNumber}
                    </p>
                  </div>

                  {/* Email */}
                  <div className='p-3 bg-gray-700 rounded-lg'>
                    <p className='text-gray-400'>Email:</p>
                    <p className='font-medium text-white'>
                      {selectedRequest.email}
                    </p>
                  </div>

                  {/* Document Section */}
                  <div className='p-3 bg-gray-700 rounded-lg'>
                    <p className='text-gray-400 mb-2'>Documents:</p>
                    {[
                      { label: 'Approval Letter', key: 'approvalLetter' },
                      { label: 'Building Plan', key: 'buildingPlan' },
                      { label: 'Fire Plans', key: 'firePlans' },
                      { label: 'Ownership Document', key: 'ownershipDocument' },
                      {
                        label: 'Fire Consultant Certificate',
                        key: 'fireConsultantCertificate'
                      },
                      { label: 'Checklist', key: 'checklist' }
                    ].map(({ label, key }) => (
                      <div
                        key={key}
                        className='flex justify-between items-center p-2 bg-gray-600 rounded-lg mb-2'
                      >
                        <p className='text-gray-300'>{label}</p>
                        <div className='flex gap-2'>
                          <a
                            href={`${selectedRequest[key]}`}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-blue-400 hover:underline'
                          >
                            View
                          </a>
                          <a
                            href={`${selectedRequest[key]}`}
                            download
                            className='text-green-400 hover:underline'
                          >
                            Download
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Formik Form for Status Management */}
                  {console.log('Status ==.', selectedRequest?.status)}
                  <Formik
                    initialValues={{
                      ...selectedRequest,
                      id: selectedRequest?.id,
                      status: selectedRequest?.status,
                      remarks: ''
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values, { setSubmitting }) => {
                      console.log(values) // Debugging: Check if form values are captured
                      handleSubmit(values) // Ensure `handleSubmit` is correctly defined
                      setSubmitting(false)
                    }}
                  >
                    {({ values, isSubmitting }) => (
                      <Form className='space-y-4'>
                        {/* Status Dropdown */}
                        <div>
                          <label className='block text-gray-400 mb-1'>
                            Status
                          </label>
                          <Field
                            as='select'
                            name='status'
                            value={values?.status}
                            className='w-full p-2 bg-gray-700 text-white rounded-lg border border-gray-600'
                          >
                            <option value='pending'>Pending</option>
                            <option value='approved'>Approved</option>
                            <option value='rejected'>Rejected</option>
                          </Field>
                          <ErrorMessage
                            name='status'
                            component='p'
                            className='text-red-400 text-sm'
                          />
                        </div>

                        {/* Remarks Textbox (only if Rejected) */}
                        {values.status === 'rejected' && (
                          <div>
                            <label className='block text-gray-400 mb-1'>
                              Remarks
                            </label>
                            <Field
                              as='textarea'
                              name='remarks'
                              rows='3'
                              className='w-full p-2 bg-gray-700 text-white rounded-lg border border-gray-600'
                              placeholder='Enter remarks for rejection'
                            />
                            <ErrorMessage
                              name='remarks'
                              component='p'
                              className='text-red-400 text-sm'
                            />
                          </div>
                        )}

                        {/* Submit Button */}
                        <button
                          type='submit'
                          disabled={isSubmitting}
                          className='w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg'
                        >
                          {isSubmitting ? 'Updating...' : 'Update Status'}
                        </button>
                      </Form>
                    )}
                  </Formik>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PendingRequests
