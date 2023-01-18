import nodemailer from 'nodemailer'
import Mailgen from 'mailgen'

export const registerMail = async (req, res) => {
  const { email, username } = req.body
  let config = {
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  }
  let transporter = nodemailer.createTransport(config)

  let MailGenerator = new Mailgen({
    theme: 'default',
    product: {
      name: 'Petolatunji',
      link: 'https://mailgen.js/',
    },
  })

  let response = {
    body: {
      name: username,
      intro: 'Resgistered Successfully',
      table: {
        data: [
          {
            item: 'Nodemailer Stack Book',
            description: 'A Backend application',
            price: '2000K',
          },
        ],
      },
      outro: 'Looking forward to do more',
    },
  }
  let mail = MailGenerator.generate(response)
  let message = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Confirm to continue your Registration',
    text: 'Plaintext version of the message',
    html: mail,
  }
  transporter
    .sendMail(message)
    .then(() => {
      return res.status(201).json({ msg: 'you should recieve mail' })
    })
    .catch((error) => {
      return res.status(500).json({ error })
    })
}
