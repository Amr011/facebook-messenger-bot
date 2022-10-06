const nodemailer = require('nodemailer')

async function sendEmail(data) {
   try {
      const transporter = nodemailer.createTransport({
         host: process.env.EMAIL_HOST,
         port: process.env.EMAIL_PORT,
         secure: false,
         auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
         },
      })

      transporter.sendMail({
         from: process.env.EMAIL_SENDER,
         to: process.env.EMAIL_RECEIVER,
         subject: 'New order received!',
         html: `
        <h2>Product Details</h2>
        <p><b>Product Id: </b> ${data.id} </p>
        <p><b>Product Title:</b> ${data.title} </p>
        <p><b>Product Description:</b> ${data.desc} </p>
        <p><b>Product Price:</b> ${data.price} </p>
        <p><b>Product Shipping Fee:</b> ${data.shipping} </p>
        `,
      })
   } catch (error) {
      console.log(error)
   }
}
module.exports = sendEmail
