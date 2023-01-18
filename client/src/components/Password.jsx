import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Avatar from '../assets/avat.png'
import styles from '../styles/Username.module.css'
import toast, { Toaster } from 'react-hot-toast'
import { useFormik } from 'formik'
import { passwordValidate } from '../helper/validate'
import useFetch from '../hooks/fetchHook'
import { useAuthStore } from '../store/store'
import { verifyPassword } from '../helper/helper'

const Password = () => {
  const navigate = useNavigate()
  const { username } = useAuthStore((state) => state.auth)
  const [{ isLoading, apiData, serverError }] = useFetch(`/user/${username}`)

  const formik = useFormik({
    initialValues: { password: '' },
    validate: passwordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      let loginPromise = verifyPassword({ username, password: values.password })
      toast.promise(loginPromise, {
        loading: 'Checking',
        success: <b>Login Successfully</b>,
        error: <b>Password not Match</b>,
      })
      loginPromise.then((res) => {
        let { token } = res.data
        localStorage.setItem('token', token)
        navigate('/profile')
      })
    },
  })
  if (isLoading)
    return <h1 className='text-2xl font-bold text-center'>Loading.....</h1>
  if (serverError)
    return <h1 className='text-2xl text-red-600'>{serverError.message}</h1>

  return (
    <div className='container mx-auto'>
      <Toaster position='top-center' reverseOrder={false}></Toaster>
      <div className='flex justify-center items-center  h-screen'>
        <div className={styles.glass} style={{ width: '30%', height: '90%' }}>
          <div className='title flex flex-col items-center'>
            <h4 className='text-5xl font-bold'>
              Hello {apiData?.firstName || apiData?.username}
            </h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-5'>
              Explore more by connecting with us
            </span>
          </div>
          <form className='py-1' onSubmit={formik.handleSubmit}>
            <div className='profile flex justify-center py-4'>
              <img
                src={apiData?.profile || Avatar}
                alt='avatar'
                className={styles.profile_img}
              />
            </div>
            <div className='textbox flex flex-col items-center gap-6'>
              <input
                {...formik.getFieldProps('password')}
                type='password'
                placeholder='Enter your password'
                className={styles.textbox}
              />
              <button
                type='submit'
                className='bg-indigo-500 border w-3/4 py-4 rounded-lg text-gray-50 text-xl shadow-sm text-center hover:bg-[#ff6a6a]'
              >
                Sign In
              </button>
            </div>
            <div className='text-center py-4'>
              <span>
                Forgot Password?
                <Link to='/recovery' className='text-red-500 ml-2'>
                  Recover Now
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Password