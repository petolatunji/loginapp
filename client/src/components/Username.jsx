import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Avatar from '../assets/avat.png'
import styles from '../styles/Username.module.css'
import { Toaster } from 'react-hot-toast'
import { useFormik } from 'formik'
import { usernameValidate } from '../helper/validate'
import { useAuthStore } from '../store/store'

const Username = () => {
  const navigate = useNavigate()

  const setUsername = useAuthStore((state) => state.setUsername)
  // const username = useAuthStore((state) => state.auth.username)

  const formik = useFormik({
    initialValues: { username: '' },
    validate: usernameValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      setUsername(values.username)
      navigate('/password')
    },
  })
  return (
    <div className='container mx-auto'>
      <Toaster position='top-center' reverseOrder={false}></Toaster>
      <div className='flex justify-center items-center  h-screen'>
        <div className={styles.glass} style={{ width: '35%', height: '90%' }}>
          <div className='title flex flex-col items-center'>
            <h4 className='text-5xl font-bold'> Hello Again!!!</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-5'>
              Explore more by connecting with us
            </span>
          </div>
          <form className='py-1  ' onSubmit={formik.handleSubmit}>
            <div className='profile flex justify-center py-4'>
              <img src={Avatar} alt='avatar' className={styles.profile_img} />
            </div>
            <div className='textbox flex flex-col items-center gap-6'>
              <input
                {...formik.getFieldProps('username')}
                type='text'
                placeholder='Username'
                className={styles.textbox}
              />
              <button
                type='submit'
                className='bg-indigo-500 border w-3/4 py-4 rounded-lg text-gray-50 text-xl shadow-sm text-center hover:bg-[#ff6a6a]'
              >
                Next
              </button>
            </div>
            <div className='text-center py-4'>
              <span>
                Not a Member
                <Link to='/register' className='text-red-500 ml-2'>
                  Register here
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Username
