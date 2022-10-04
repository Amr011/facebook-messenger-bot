const mongoose = require('mongoose')

const con = mongoose.connect(
   process.env.MONGODB_URI,
   { useNewUrlParser: true, useUnifiedTopology: true },
   async () => {
      try {
         console.log('Database Connected Successfuly !!')
      } catch (err) {
         console.log(err)
      }
   }
)

module.exports = con
