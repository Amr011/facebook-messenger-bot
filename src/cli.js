const _ = require('lodash')
const nodemailer = require('nodemailer')
const obj = require('./data.json')
const sendEmail = require('./email')

// a function for finding the matched product from src/data.json file by passing product id (prdID) as number type param
function findMatchedProduct(prdID) {
   try {
      return _.find(obj, { id: prdID })
   } catch (error) {
      console.log(error)
   }
}

// a function require (str) as a string type param to check if the entered value is a valid command
function cmdCheck(str = '') {
   try {
      if (
         str.length > 0 && // check if string exist
         str.includes('/') && // check if string includes "/"
         str.indexOf('/') == 0 && // check if it's a command
         str.split(' ').length == 1 // check if the commands include a value
      ) {
         return {
            // return an object with the command input and the value
            command: str.split(' ')[0].split('/')[1],
            value: str.split(' ')[1],
         }
      } else return false
   } catch (error) {
      console.log(error)
   }
}

// a function require (obj) as an object type param to check if the entered value is a valid command & return a value of result search for a product
function cmdCommandCheck(obj) {
   try {
      // Check if it's price command
      if (obj.command == 'price') {
         if (findMatchedProduct(parseInt(obj.value))) {
            return `${findMatchedProduct(parseInt(obj.value)).title}\n Price:${
               findMatchedProduct(parseInt(obj.value)).price
            }` // if true return price
         } else return false
         // Check if it's description command
      } else if (obj.command == 'desc') {
         if (findMatchedProduct(parseInt(obj.value))) {
            return `${
               findMatchedProduct(parseInt(obj.value)).title
            }\n Description:${findMatchedProduct(parseInt(obj.value)).desc}` // if true retrun description
         } else return false
         // Check if it's shipping command
      } else if (obj.command == 'shipping') {
         if (findMatchedProduct(parseInt(obj.value))) {
            return `${
               findMatchedProduct(parseInt(obj.value)).title
            }\n Shipping:${findMatchedProduct(parseInt(obj.value)).shipping}` // if true return shipping cost
         } else return false
         // Check if it's buy command
      } else if (obj.command == 'buy') {
         if (findMatchedProduct(parseInt(obj.value))) {
            sendEmail(findMatchedProduct(parseInt(obj.value))) // if true send email
         } else return false
      }
      return false
   } catch (error) {
      console.log(error)
   }
}

module.exports = { cmdCommandCheck, cmdCheck }
