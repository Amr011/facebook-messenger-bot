// Imports dependencies and set up http server
const request = require('request'),
   express = require('express'),
   bodyParser = require('body-parser'),
   app = express().use(bodyParser.json()) // creates express http server

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'))

// Creates the endpoint for our webhook
app.post('/webhook', (req, res) => {
   let body = req.body

   // Checks this is an event from a page subscription
   if (body.object === 'page') {
      // Iterates over each entry - there may be multiple if batched
      body.entry.forEach(function (entry) {
         // Gets the message. entry.messaging is an array, but
         // will only ever contain one message, so we get index 0
         let webhookEvent = entry.messaging[0]
         console.log(webhookEvent)

         // Get sender PSID
         let senderPsid = webhookEvent.sender.id
         console.log('Sender PSID: ' + senderPsid)

         // Check if the event is a message or postback and
         // pass the event to the appropriate handler function
         if (webhookEvent.message) {
            handleMessage(senderPsid, webhookEvent.message)
         } else if (webhookEvent.postback) {
            handlePostback(senderPsid, webhookEvent.postback)
         }
      })

      // Returns a '200 OK' response to all requests
      res.status(200).send('EVENT_RECEIVED')
   } else {
      // Returns a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404)
   }
})

// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {
   // Your verify token. Should be a random string.
   let VERIFY_TOKEN = process.env.VERIFICATION_TOKEN

   // Parse the query params
   let mode = req.query['hub.mode']
   let token = req.query['hub.verify_token']
   let challenge = req.query['hub.challenge']

   // Checks if a token and mode is in the query string of the request
   if (mode && token) {
      // Checks the mode and token sent is correct
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
         // Responds with the challenge token from the request
         console.log('WEBHOOK_VERIFIED')
         res.status(200).send(challenge)
      } else {
         // Responds with '403 Forbidden' if verify tokens do not match
         res.sendStatus(403)
      }
   }
})

// Handles messages events
function handleMessage(senderPsid, receivedMessage) {
   let response
   const msgResponses = [
      'How are you?',
      "I hope you're doing well.",
      "I hope you're having a great day.",
   ]

   var botRes = msgResponses[Math.floor(Math.random() * msgResponses.length)]

   // Checks if the message contains text
   if (receivedMessage.text === 'شو يا لوطي') {
      // Create the payload for a basic text message, which
      // will be added to the body of your request to the Send API
      response = {
         text: botRes,
      }
   }

   // Send the response message
   callSendAPI(senderPsid, response)
}

// Handles messaging_postbacks events
function handlePostback(senderPsid, receivedPostback) {
   let response

   // Get the payload for the postback
   let payload = receivedPostback.payload

   // Set the response based on the postback payload
   if (payload === 'yes') {
      response = { text: 'Thanks!' }
   } else if (payload === 'no') {
      response = { text: 'Oops, try sending another image.' }
   }
   // Send the message to acknowledge the postback
   callSendAPI(senderPsid, response)
}

// Sends response messages via the Send API
function callSendAPI(senderPsid, response) {
   // The page access token we have generated in your app settings
   const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN

   // Construct the message body
   let requestBody = {
      recipient: {
         id: senderPsid,
      },
      messaging_type: 'RESPONSE',
      message: response,
   }

   // Send the HTTP request to the Messenger Platform
   request(
      {
         uri: 'https://graph.facebook.com/v15.0/me/messages',
         qs: { access_token: PAGE_ACCESS_TOKEN },
         method: 'POST',
         json: requestBody,
      },
      (err, _res, _body) => {
         if (!err) {
            console.log('Message sent!')
         } else {
            console.error('Unable to send message:' + err)
         }
      }
   )
}
