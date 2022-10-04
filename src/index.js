const express = require('express')
const app = express()

const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

const dotenv = require('dotenv')

const request = require('request')
const crypto = require('crypto')

// Setup middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.use(cors())

// Error Handling
app.use(errorHandler)

// Env Files Config
dotenv.config()

// Verify that the callback came from Facebook.
function verifyRequestSignature(req, res, buf) {
   var signature = req.headers['x-hub-signature']

   if (!signature) {
      console.warn(`Couldn't find "x-hub-signature" in headers.`)
   } else {
      var elements = signature.split('=')
      var signatureHash = elements[1]
      var expectedHash = crypto
         .createHmac('sha1', config.appSecret)
         .update(buf)
         .digest('hex')
      if (signatureHash != expectedHash) {
         throw new Error("Couldn't validate the request signature.")
      }
   }
}

//Create the endpoint for your webhook
app.post('/webhook', (req, res) => {
   let body = req.body

   console.log(`\u{1F7EA} Received webhook:`)
   console.dir(body, { depth: null })

   // Send a 200 OK response if this is a page webhook
   if (body.object === 'page') {
      // Returns a '200 OK' response to all requests
      res.status(200).send('EVENT_RECEIVED')
   } else {
      // Return a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404)
   }
})

// Add support for GET requests to our webhook
app.get('/messaging-webhook', (req, res) => {
   // Parse the query params
   let mode = req.query['hub.mode']
   let token = req.query['hub.verify_token']
   let challenge = req.query['hub.challenge']

   // Check if a token and mode is in the query string of the request
   if (mode && token) {
      // Check the mode and token sent is correct
      if (mode === 'subscribe' && token === config.verifyToken) {
         // Respond with the challenge token from the request
         console.log('WEBHOOK_VERIFIED')
         res.status(200).send(challenge)
      } else {
         // Respond with '403 Forbidden' if verify tokens do not match
         res.sendStatus(403)
      }
   }
})

// app config
app.set('port', process.env.PORT || 3000)

// Unavailable Request
app.use((req, res, next) => {
   res.status(404).json({
      success: false,
      status: res.statusCode,
      message: 'Unavailable Request',
   })
   res.end()
})

app.listen(app.get('port'), () => {
   console.log(`Server Running`)
})
