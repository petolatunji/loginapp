import express from 'express'
import cors from 'cors'
import morgan from 'morgan'

import router from './router/router.js'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

const app = express()

/**middleware */
dotenv.config()
app.use(express.json())
app.use(cors())
app.use(morgan('tiny'))
app.disable('x-powered-by') //hacker

const port = 8080

/**HTTP Get request */
app.get('/', (req, res) => {
  res.status(201).json('Home')
})

/** API METHods */
app.use('/api', router)

/**start server only when there is valid connection */
mongoose
  .connect(process.env.ATLAS_URI)
  .then(() => {
    try {
      app.listen(port, () => {
        console.log(`Server connected to http://localhost:${port}`)
      })
    } catch (error) {
      console.log('cannot connect to db')
    }
  })
  .catch((error) => {
    console.log('invalid db connection')
  })
