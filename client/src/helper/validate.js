import { toast } from 'react-hot-toast'
import { authenticate } from './helper'

/**validate login page username */
export async function usernameValidate(values) {
  const errors = usernameVerify({}, values)
  if (values.username) {
    //check user existence

    const { status } = await authenticate(values.username)
    if (status !== 200) {
      errors.exist = toast.error('User does not exist')
    }
  }
  return errors
}
/**validate login page password */
export async function passwordValidate(values) {
  const errors = passwordVerify({}, values)

  return errors
}

/**validate reset password */
export async function resetPasswordValidation(values) {
  const errors = passwordVerify({}, values)
  return errors
}

/**validate register form */
export async function registerValidate(values) {
  const errors = usernameVerify({}, values)
  passwordVerify(errors, values)
  emailVerify(errors, values)
  return errors
}

/**validate profile page */
export async function profileValidate(values) {
  const errors = emailVerify({}, values)
  return errors
}

/**validate username */
function usernameVerify(error = {}, values) {
  if (!values.username) {
    error.username = toast.error('Enter Your Username...!')
  } else if (values.username.includes(' ')) {
    error.username = toast.error('Invalid Username...')
  }
  return error
}

/**validate password */
function passwordVerify(errors = {}, values) {
  const specialCharacters = /[`!@#$%^&*()_+/-=\[\]{};':"\\|,.<>\/?~]/

  if (!values.password) {
    errors.password = toast.error('Password Required...!')
  } else if (values.password.includes(' ')) {
    errors.password = toast.error('Wrong Password...')
  } else if (values.password.length < 4) {
    errors.password = toast.error(
      'Password must be more than 4 characters long...'
    )
  } else if (!specialCharacters.test(values.password)) {
    errors.password = toast.error('Password Must Have Special Characters...')
  }
  return errors
}

/**validate email */
function emailVerify(error = {}, values) {
  if (!values.email) {
    error.email = toast.error('Enter Your email...!')
  } else if (values.email.includes(' ')) {
    error.email = toast.error('Wrong Email...')
  } else if (!/[`!@#$%^&*()_+/-=\[\]{};':"\\|,.<>\/?~]/) {
    error.email = toast.error('Invalid Email')
  }
  return error
}
