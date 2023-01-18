import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Avatar from '../assets/avat.png'
import styles from '../styles/Username.module.css'
import extend from '../styles/Profile.module.css'
import toast, { Toaster } from 'react-hot-toast'
import { useFormik } from 'formik'
import { useState } from 'react'
import convertToBase64 from '../helper/convert'
import { profileValidate } from '../helper/validate'
import useFetch from '../hooks/fetchHook'
import { useAuthStore } from '../store/store'
import { updateUser } from '../helper/helper'

const Profile = () => {
  const navigate = useNavigate()
  const [{ isLoading, apiData, serverError }] = useFetch()

  const [file, setFile] = useState()
  const formik = useFormik({
    initialValues: {
      firstName: apiData?.firstName || '',
      lastName: apiData?.lastName || '',
      email: apiData?.email || '',
      mobile: apiData?.mobile || '',
      address: apiData?.address || '',
    },
    enableReinitialize: true,
    validate: profileValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values = await Object.assign(values, {
        profile: file || apiData?.profile || '',
      })
      let updatePromise = updateUser(values)
      toast.promise(updatePromise, {
        loading: 'updating',
        success: <b>Updated Successfully</b>,
        error: <b>could not Update</b>,
      })
      console.log(values)
    },
  })
  /** function for file upload */
  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0])
    setFile(base64)
  }
  // logout handler function
  function userLogout() {
    localStorage.removeItem('token')
    navigate('/')
  }

  if (isLoading)
    return <h1 className='text-2xl font-bold text-center'>Loading.....</h1>
  if (serverError)
    return <h1 className='text-2xl text-red-600'>{serverError.message}</h1>

  return (
    <div className='container mx-auto'>
      <Toaster position='top-center' reverseOrder={false}></Toaster>
      <div className='flex justify-center items-center  h-screen'>
        <div
          className={`${styles.glass} ${extend.glass}`}
          style={{ width: '5%', height: '100%' }}
        >
          <div className='title flex flex-col items-center'>
            <h4 className='text-5xl font-bold'> Profile</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-5'>
              You can update your details
            </span>
          </div>
          <form className='py-1' onSubmit={formik.handleSubmit}>
            <div className='profile flex justify-center py-4'>
              <label htmlFor='profile' name='profile'>
                <img
                  src={apiData?.profile || file || Avatar}
                  alt='avatar'
                  className={`${styles.profile_img} ${extend.profile_img}`}
                />
              </label>
              <input onChange={onUpload} type='file' id='profile' />
            </div>
            <div className='textbox flex flex-col items-center gap-6'>
              <div className='name flex flex w-3/4 gap-10   '>
                <input
                  {...formik.getFieldProps('firstName')}
                  type='text'
                  placeholder='FirstName'
                  className={`${styles.textbox} ${extend.textbox} `}
                />
                <input
                  {...formik.getFieldProps('lastName')}
                  type='text'
                  placeholder='LastName'
                  className={`${styles.textbox} ${extend.textbox}`}
                />
              </div>
              <div className='name flex w-3/4 gap-10'>
                <input
                  {...formik.getFieldProps('mobile')}
                  type='text'
                  placeholder='Mobile No.'
                  className={`${styles.textbox} ${extend.textbox}`}
                />
                <input
                  {...formik.getFieldProps('email')}
                  type='email'
                  placeholder='Email Address'
                  className={`${styles.textbox} ${extend.textbox}`}
                />
              </div>

              <input
                {...formik.getFieldProps('address')}
                type='text'
                placeholder='Address'
                className={`${styles.textbox} ${extend.textbox}`}
              />
              <button
                type='submit'
                className='bg-indigo-500 border w-3/4 py-4 rounded-lg text-gray-50 text-xl shadow-sm text-center hover:bg-[#ff6a6a]'
              >
                Update
              </button>
            </div>
            <div className='text-center py-4 '>
              <span className='text-gray-500'>
                Come back later
                <button className='text-red-500 ml-2' onClick={userLogout}>
                  Logout
                </button>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile
