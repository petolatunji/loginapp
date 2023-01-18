import axios from 'axios'
import jwt_decode from 'jwt-decode'
axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN

/**MAKING API REQUEST */

/**to get information from token */
export async function getUsername() {
  const token = localStorage.getItem('token')
  if (!token) return Promise.reject('Cannot find Token')
  let decode = jwt_decode(token)
  return decode
}

/**aUTHENTICATE function */
export async function authenticate(username) {
  try {
    return await axios.post('/api/authenticate', { username })
  } catch (error) {
    return { error: 'username doesnt exist' }
  }
}

/**get user details */
export async function getUser({ username }) {
  try {
    const { data } = await axios.get(`/api/user/${username}`)
    return { data }
  } catch (error) {
    return { error: 'Password doesnt match' }
  }
}

/**register user function */
export async function registerUser(crendential) {
  try {
    const {
      data: { msg },
      status,
    } = await axios.post(`/api/register`, crendential)
    let { username, email } = crendential

    /**send mail */
    if (status === 201) {
      await axios.post('/api/regiserMail', {
        username,
        userEmail: email,
        text: msg,
      })
    }
  } catch (error) {}
}

/**login function */
export async function verifyPassword({ username, password }) {
  try {
    if (username) {
      const { data } = await axios.post('/api/login', { username, password })
      return Promise.resolve({ data })
    }
  } catch (error) {
    return Promise.reject({ error: 'Password doesnt mactch' })
  }
}

/**update user function */
export async function updateUser(response) {
  try {
    const token = await localStorage.getItem('token')
    const data = await axios.put('/api/updateuser', response, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return Promise.resolve({ data })
  } catch (error) {
    return Promise.reject({ error: 'Couldnt update profile' })
  }
}

/**generate OTP */
export async function generateOTP(username) {
  try {
    const {
      data: { code },
      status,
    } = await axios.get('/api/generateOTP', { params: { username } })

    // send mail with the OTP
    /** 
    if (status === 201) {
      let {
        data: { email },
      } = await getUser({ username })
      let text = `Your Password Recovery OTP is ${code}. Verify and recover your password.`
      await axios.post('/api/registerMail', {
        username,
        userEmail: email,
        text,
        subject: 'Password Recovery OTP',
      })
    }*/
    return Promise.resolve(code)
  } catch (error) {
    return Promise.reject({ error })
  }
}

/**Verify OTP */
export async function verifyOTP({ username, code }) {
  try {
    const { data, status } = await axios.get('/api/verifyOTP', {
      params: { username, code },
    })
    return { data, status }
  } catch (error) {
    return Promise.reject({ error })
  }
}

/**Reset Password */
export async function resetPassword({ username, password }) {
  try {
    const { data, status } = await axios.put('/api/resetPassword', {
      username,
      password,
    })
    return Promise.resolve({ data, status })
  } catch (error) {
    return Promise.reject({ error })
  }
}
