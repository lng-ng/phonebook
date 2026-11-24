
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const dbURL = process.env.MONGODB_URI
const phonebookSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    required: true,
    minLength: 8,
    validate: [{
      validator: value => {
        const split = value.split('-')
        return split.length == 2 && split[0].length > 2 && split[0].length <= 3 && split[1].length > 0
      },
      message: 'number must be formed of two parts that are separated by -, the first part has two or three numbers and the second part also consists of numbers'
    },]
  }
})

module.exports = mongoose.model('Entry', phonebookSchema)

mongoose.connect(dbURL, {family:4})
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log(error.message)
  })

