import React, { useEffect, useState } from 'react'
import { FaBell, FaClipboardList, FaUsersCog } from 'react-icons/fa'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import axiosHandler from '../lib/axiosInterceptor'

const FireNOCDashboard = () => {
  const mockData = {
    monthlySubmissions: [
      { month: 'Jan', submissions: 65 },
      { month: 'Feb', submissions: 45 },
      { month: 'Mar', submissions: 90 },
      { month: 'Apr', submissions: 75 },
      { month: 'May', submissions: 85 },
      { month: 'Jun', submissions: 120 }
    ],
    pendingTrend: [
      { date: '2024-01', pending: 30 },
      { date: '2024-02', pending: 45 },
      { date: '2024-03', pending: 25 },
      { date: '2024-04', pending: 60 },
      { date: '2024-05', pending: 40 },
      { date: '2024-06', pending: 35 }
    ],
    approvalBreakdown: [
      { name: 'Approved', value: 55 },
      { name: 'Pending', value: 30 },
      { name: 'Rejected', value: 15 }
    ]
  }

  const [data, setData] = useState({})

  const COLORS = ['#FF4500', '#FF6347', '#708090']

  const StatCard = ({ icon: Icon, title, value }) => (
    <div className='bg-gray-800 p-4 rounded-lg shadow-lg'>
      <div className='flex items-center justify-between'>
        <div>
          <p className='text-gray-400 text-sm'>{title}</p>
          <h3 className='text-2xl font-bold text-white mt-1'>{value}</h3>
        </div>
        <Icon className='text-[#FF4500] text-3xl' />
      </div>
    </div>
  )

  const fetchDashboardData = async () => {
    const response = await axiosHandler.get('api/dashboard')

    if (response?.status === 200) {
      setData({
        ...response?.data,
        monthlySubmissions: [
          // Preserve existing data first
          { month: 'Sep', submissions: 65 },
          { month: 'Oct', submissions: 45 },
          { month: 'Nov', submissions: 90 },
          { month: 'Dec', submissions: 75 },
          { month: 'Jan', submissions: 85 },
          { month: 'Feb', submissions: 120 },
          ...response?.data?.monthlySubmissions
        ]
      })
    }
  }

  console.log('Data ===>', data)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  return (
    <div className='flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-800'>
      {/* Sidebar */}

      {/* Main Content */}
      <div className='flex-1 p-8'>
        {/* <div className='flex justify-between items-center mb-6'>
          <h1 className='text-white text-2xl font-bold'>Dashboard</h1>
          <button className='bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700'>
            Download Reports
          </button>
        </div> */}

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          <StatCard
            icon={FaUsersCog}
            title='Total Users'
            value={data?.totalUsers}
          />
          <StatCard icon={FaBell} title='Active Incidents' value='12' />
          <StatCard
            icon={FaClipboardList}
            title='NOC Requests'
            value={data?.totalNOCRequests}
          />
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
          {/* NOC Submission Overview */}
          <div className='bg-gray-800 p-6 rounded-lg shadow-lg'>
            <h2 className='text-white text-xl font-bold mb-4'>
              NOC Submissions Overview
            </h2>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={data.monthlySubmissions}>
                <CartesianGrid strokeDasharray='3 3' stroke='#444' />
                <XAxis dataKey='month' stroke='#fff' />
                <YAxis stroke='#fff' />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937' }} />
                <Bar dataKey='submissions' fill='#FF4500' />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pending Requests Trend */}
          <div className='bg-gray-800 p-6 rounded-lg shadow-lg'>
            <h2 className='text-white text-xl font-bold mb-4'>
              Pending Requests Trend
            </h2>
            <ResponsiveContainer width='100%' height={300}>
              <LineChart data={data.pendingTrend}>
                <CartesianGrid strokeDasharray='3 3' stroke='#444' />
                <XAxis dataKey='date' stroke='#fff' />
                <YAxis stroke='#fff' />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937' }} />
                <Line
                  type='monotone'
                  dataKey='pending'
                  stroke='#FF6347'
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* NOC Approval Breakdown */}
        <div className='bg-gray-800 p-6 rounded-lg shadow-lg'>
          <h2 className='text-white text-xl font-bold mb-4'>
            NOC Approval Breakdown
          </h2>
          <ResponsiveContainer width='100%' height={300}>
            <PieChart>
              <Pie
                data={data?.approvalBreakdown}
                cx='50%'
                cy='50%'
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey='value'
              >
                {data?.approvalBreakdown?.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS?.length]}
                  />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1f2937' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default FireNOCDashboard
