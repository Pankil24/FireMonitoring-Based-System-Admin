import React, { useState } from 'react'
import { FaFire } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import { setUserInfo } from './Redux/slice/userSlice'
import { useNavigate } from 'react-router-dom'
import axiosHandler from '../lib/axiosInterceptor'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { apiEndPoints } from '../lib/base-url'
import { customToast } from '../lib/AllGlobalFunctions'
import TextError from '../Components/TextError'

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const validationSchema = isSignUp
    ? Yup.object().shape({
        email: Yup.string()
          .email('Invalid email address')
          .required('Email Required'),
        name: Yup.string().required('Please enter user name'),
        password: Yup.string().required('Password Required')
      })
    : Yup.object().shape({
        email: Yup.string()
          .email('Invalid email address')
          .required('Email Required'),
        password: Yup.string().required('Password Required')
      })

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-xl shadow-lg'>
        <div className='text-center'>
          <FaFire className='mx-auto h-12 w-12 text-[#FF4500]' />
          <h2 className='mt-6 text-3xl font-extrabold'>
            {isSignUp ? 'Create an Account' : 'Fire NOC Portal'}
          </h2>
          <p className='mt-2 text-sm text-gray-400'>
            {isSignUp ? 'Sign up to get started' : 'Sign in to your account'}
          </p>
        </div>

        <Formik
          enableReinitialize
          initialValues={
            isSignUp
              ? {
                  email: '',
                  name: '',
                  password: ''
                }
              : {
                  email: '',
                  password: ''
                }
          }
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            try {
              console.log('Values ==>', values)
              const response = await axiosHandler.post(
                isSignUp
                  ? apiEndPoints?.adminRegister
                  : apiEndPoints?.adminLogin,
                values
              )

              console.log('Response ==>', response)
              if (response?.status === 201 || response?.status === 200) {
                dispatch(
                  setUserInfo({
                    userInfo: {
                      ...response?.data
                      // userName: 'Pankil',
                      // email: 'pankilpna@gmail.com',
                      // createdAt: '04-03-2025'
                    }
                  })
                )
                customToast(dispatch, response)
                navigate('/')
              }
            } catch (error) {
              console.log('Error :', error)
              customToast(dispatch, error?.response)
            }
          }}
        >
          {({ values, setFieldValue, errors }) => (
            <Form className='mt-8 space-y-6'>
              <div className='rounded-md shadow-sm space-y-4'>
                {isSignUp && (
                  <div>
                    <Field
                      id='name'
                      name='name'
                      type='text'
                      required
                      className='appearance-none rounded-lg block w-full px-3 py-2 border border-gray-600 bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-[#FF4500] focus:border-[#FF4500]'
                      placeholder='User Name'
                      value={values?.name}
                      onChange={(e) => {
                        setFieldValue('name', e?.target?.value)
                      }}
                    />
                    <ErrorMessage name='name' component={TextError} />
                  </div>
                )}
                <div>
                  <Field
                    id='email'
                    name='email'
                    type='email'
                    required
                    className='appearance-none rounded-lg block w-full px-3 py-2 border border-gray-600 bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-[#FF4500] focus:border-[#FF4500]'
                    placeholder='Email address'
                    value={values?.email}
                    onChange={(e) => {
                      setFieldValue('email', e?.target?.value)
                    }}
                  />
                  <ErrorMessage name='email' component={TextError} />
                </div>
                <div>
                  <Field
                    id='password'
                    name='password'
                    type='password'
                    required
                    className='appearance-none rounded-lg block w-full px-3 py-2 border border-gray-600 bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-[#FF4500] focus:border-[#FF4500]'
                    placeholder='Password'
                    value={values?.password}
                    onChange={(e) => {
                      setFieldValue('password', e?.target?.value)
                    }}
                  />
                  <ErrorMessage name='password' component={TextError} />
                </div>
              </div>

              <div>
                <button
                  type='submit'
                  className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#FF4500] hover:bg-[#FF6347] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF4500]'
                  // onClick={() => {
                  //   handleSubmit()
                  // }}
                >
                  {isSignUp ? 'Sign Up' : 'Sign In'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
        <form className='mt-8 space-y-6'></form>
        <p className='mt-4 text-center text-sm text-gray-400'>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span
            className='text-[#FF4500] cursor-pointer hover:underline'
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </span>
        </p>
      </div>
    </div>
  )
}

export default Login
