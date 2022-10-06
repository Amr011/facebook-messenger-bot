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
        <b>Product Id: </b> ${data.id}
        <b>Product Title:</b> ${data.title}
        <b>Product Description:</b> ${data.desc}
        <b>Product Price:</b> ${data.price}
        <b>Product Shipping Fee:</b> ${data.shipping}
        `,
      })
   } catch (error) {
      console.log(error)
   }
}
module.exports = sendEmail
