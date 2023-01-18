import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Avatar from '../assets/avat.png'
import styles from '../styles/Username.module.css'
import toast, { Toaster } from 'react-hot-toast'
import { useFormik } from 'formik'
import { passwordValidate } from '../helper/validate'
import { useState } from 'react'
import convertToBase64 from '../helper/convert'
import { registerValidate } from '../helper/validate'
import { registerUser } from '../helper/helper'

const Register = () => {
  const navigate = useNavigate()
  const [file, setFile] = useState()
  const formik = useFormik({
    initialValues: {
      email: '',
      username: '',
      password: '',
    },
    validate: registerValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values = await Object.assign(values, { profile: file || '' })
      let registerPromise = registerUser(values)
      toast.promise(registerPromise, {
        loading: 'Registering',
        success: <b>Register Successfully</b>,
        error: <b>Could not Register.</b>,
      })
      registerPromise.then(function () {
        navigate('/')
      })
    },
  })
  /** function for file upload */
  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0])
    setFile(base64)
  }

  return (
    <div className='container mx-auto'>
      <Toaster position='top-center' reverseOrder={false}></Toaster>
      <div className='flex justify-center items-center  h-screen'>
        <div className={styles.glass} style={{ width: '45%', height: '100%' }}>
          <div className='title flex flex-col items-center'>
            <h4 className='text-5xl font-bold'> Register</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-5'>
              Happy to join you
            </span>
          </div>
          <form className='py-1' onSubmit={formik.handleSubmit}>
            <div className='profile flex justify-center py-4'>
              <label htmlFor='profile' name='profile'>
                <img
                  src={file || Avatar}
                  alt='avatar'
                  className={styles.profile_img}
                />
              </label>
              <input onChange={onUpload} type='file' id='profile' />
            </div>
            <div className='textbox flex flex-col items-center gap-6'>
              <input
                {...formik.getFieldProps('email')}
                type='email'
                placeholder='Enter your email*'
                className={styles.textbox}
              />
              <input
                {...formik.getFieldProps('username')}
                type='text'
                placeholder='Enter your username*'
                className={styles.textbox}
              />
              <input
                {...formik.getFieldProps('password')}
                type='password'
                placeholder='Enter your password*'
                className={styles.textbox}
              />
              <button
                type='submit'
                className='bg-indigo-500 border w-3/4 py-4 rounded-lg text-gray-50 text-xl shadow-sm text-center hover:bg-[#ff6a6a]'
              >
                Register
              </button>
            </div>
            <div className='text-center py-4'>
              <span>
                Already Registered?
                <Link to='/' className='text-red-500 ml-2'>
                  Login Now
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
