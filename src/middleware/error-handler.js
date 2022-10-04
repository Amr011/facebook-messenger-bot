function errorHandler(err, req, res, next) {
   switch (true) {
      case err:
      default:
         return res.status(500).json({ message: err.message })
   }
}
module.exports = errorHandler
