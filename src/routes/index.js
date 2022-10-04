const express = require('express')

const router = express.Router()
const request = require('request')
const crypto = require('crypto')

router.route('/').get((req, res) => {
   return res.status(200).json('It Works Now')
})

const APP_SECRET = process.env.APP_SECRET
const ACCESS_TOKEN = process.env.ACCESS_TOKEN
const CALLBACK_USER_TOKEN = process.env.CALLBACK_USER_TOKEN

router.get('/webhooks', (req, res) => {
   let mode = req.query['hub.mode']
   let chal = req.query['hub.challenge']
   let tok = req.query['hub.verify_token']
   if (tok === CALLBACK_USER_TOKEN) {
      res.send(chal)
   } else {
      res.send('error')
   }
})

router.post('/webhooks', async (req, res) => {
   verifyRequestSignature(req, res)
   // console.log(JSON.stringify(req.body))
   for (const e of req.body.entry) {
      if (e.messaging)
         for (const m of e.messaging) {
            await fb_msg_process(m.sender.id, m.message)
         }
   }
   res.send({ success: 1 })
})

function verifyRequestSignature(req, res) {
   const expectedSignature =
      'sha1=' +
      crypto.createHmac('sha1', APP_SECRET).update(req.rawBody).digest('hex')
   if (req.headers['x-hub-signature'] !== expectedSignature)
      throw new Error('Invalid signature.')
}

async function fb_msg_process(senderId, msg) {
   let resp = { text: "I don't know what you mean :(" }

   if (msg && msg.text) {
      let text = msg.text.toLowerCase()
      if (msg.quick_reply && msg.quick_reply.payload)
         text = msg.quick_reply.payload

      switch (true) {
         case /^hi$/.test(text):
            resp = 'How are you?'
            break
         case /^hello+$/.test(text):
            resp = "I hope you're doing well."
            break
         case /^welcome+$/.test(text):
            resp = "I hope you're having a great day."
            break
      }
   }

   fb_msg_reply(senderId, resp)
}

function fb_msg_reply(senderId, response) {
   request(
      {
         url: 'https://graph.facebook.com/v15.0/me/messages',
         qs: { access_token: ACCESS_TOKEN },
         method: 'POST',
         json: { recipient: { id: senderId }, message: response },
      },
      function (error, response, body) {
         if (error) console.log('sending error', error)
         else if (response.body.error)
            console.log('response body error', response.body)
      }
   )
}

module.exports = router
