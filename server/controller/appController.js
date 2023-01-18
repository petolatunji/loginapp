import UserModel from '../model/User.model.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import otpGenerator from 'otp-generator'

/**middleware to verify user */
export async function verifyUser(req, res, next) {
  try {
    const { username } = req.method == 'GET' ? req.query : req.body
    // check the user existence
    let exist = await UserModel.findOne({ username })
    if (!exist) return res.status(404).send({ error: 'cant find use' })
    next()
  } catch (error) {
    return res.status(404).send({ error: 'Authentication Error' })
  }
}

/**PUT: http://localhost:8080/api/register*/
export async function register(req, res) {
  try {
    const { username, password, profile, email } = req.body
    //check the existing user
    const existUsername = new Promise((resolve, reject) => {
      UserModel.findOne({ username }, function (err, user) {
        if (err) reject(new Error(err))
        if (user) reject({ error: 'username already exist' })
        resolve()
      })
    })

    //check the existing email
    const existEmail = new Promise((resolve, reject) => {
      UserModel.findOne({ email }, function (err, email) {
        if (err) reject(new Error(err))
        if (email) reject({ error: 'email already exist' })
        resolve()
      })
    })
    Promise.all([existUsername, existEmail])
      .then(() => {
        if (password) {
          bcrypt
            .hash(password, 10)
            .then((hashedPassword) => {
              const user = new UserModel({
                username,
                password: hashedPassword,
                profile: profile || '',
                email,
              })
              //return save result as a response
              user
                .save()
                .then((result) =>
                  res.status(201).send({ msg: 'User Registered Successfully' })
                )
                .catch((error) => res.status(500).send({ error }))
            })
            .catch((error) => {
              return res.status(500).send({
                error: 'Enable to hashed password',
              })
            })
        }
      })
      .catch((error) => {
        return res.status(500).send({ error })
      })
  } catch (error) {
    return res.status(500).send(error)
  }
}
/**POST: http://localhost:8080/api/login*/
export async function login(req, res) {
  const { username, password } = req.body
  try {
    UserModel.findOne({ username })
      .then((user) => {
        bcrypt
          .compare(password, user.password)
          .then((passwordCheck) => {
            if (!passwordCheck)
              return res.status(400).send({ error: 'Dont have password' })
            //create jwt token
            const token = jwt.sign(
              {
                userId: user._id,
                username: user.username,
              },
              process.env.JWT_SEC,
              { expiresIn: '24h' }
            )
            return res.status(200).send({
              msg: 'Login Successful',
              username: user.username,
              token,
            })
          })
          .catch((error) => {
            return res.status(400).send({ error: 'Password does not match' })
          })
      })
      .catch((error) => {
        return res.status(404).send({ error: 'Username not found' })
      })
  } catch (error) {
    return res.status(500).send({ error })
  }
}
/**get user http://localhost:8080/api/user/example123 */
export async function getUser(req, res) {
  const { username } = req.params
  try {
    if (!username) return res.status(501).send({ error: 'Invalid username' })
    UserModel.findOne({ username }, function (err, user) {
      if (err) return res.status(500).send({ err })
      if (!user) return res.status(501).send({ err: 'cannot find the user' })
      const { password, ...rest } = user._doc
      return res.status(201).send(rest)
    })
  } catch (error) {
    return res.status(404).send({ error: 'Cannot find user data' })
  }
}

/**PUT: http://localhost:8080/api/updateuser */
export async function updateUser(req, res) {
  try {
    //const id = req.query.id
    const { userId } = req.user
    if (userId) {
      const body = req.body
      //update data
      UserModel.updateOne({ _id: userId }, body, function (err, data) {
        if (err) throw err
        return res.status(201).send({ msg: 'Record Updated' })
      })
    } else {
      return res.status(401).send({ error: 'User not found' })
    }
  } catch (error) {
    return res.status(401).send({ error })
  }
}

/**GET: http://localhost:8080/api/generateOTP */
export async function generateOTP(req, res) {
  req.app.locals.OTP = await otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  })
  res.status(201).send({ code: req.app.locals.OTP })
}

/**GET: http://localhost:8080/api/verifyOTP */
export async function verifyOTP(req, res) {
  const { code } = req.query
  if (parseInt(req.app.locals.OTP) === parseInt(code)) {
    req.app.locals.OTP = null
    req.app.locals.resetSession = true
    return res.status(201).send({ msg: 'verify successfully' })
  }
  return res.status(400).send({ error: 'Invalid OTP' })
}

/** GET: http://localhost:8080/api/createResetSession */
export async function createResetSession(req, res) {
  if (req.app.locals.resetSession) {
    return res.status(201).send({ flag: req.app.locals.resetSession })
  }
  return res.status(440).send({ error: 'Session expired' })
}

/** PUT: http://localhost:8080/api/resetPassword */
export async function resetPassword(req, res) {
  try {
    if (!req.app.locals.resetSession)
      return res.status(440).send({ error: 'Session expired' })
    const { username, password } = req.body
    try {
      UserModel.findOne({ username })
        .then((user) => {
          bcrypt
            .hash(password, 10)
            .then((hashedPassword) => {
              UserModel.updateOne(
                { username: user.username },
                { password: hashedPassword },
                function (err, data) {
                  if (err) throw err
                  req.app.locals.resetSession = false
                  return res.status(201).send({ msg: 'Record Updated' })
                }
              )
            })
            .catch((e) => {
              return res
                .status(500)
                .send({ error: 'Unable to hashed password' })
            })
        })
        .catch((error) => {
          return res.status(404).send({ error: 'Username not found' })
        })
    } catch (error) {
      return res.status(500).send({ error })
    }
  } catch (error) {
    return res.status(401).send({ error })
  }
}
