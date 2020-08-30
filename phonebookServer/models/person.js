const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
mongoose.set('useUnifiedTopology', true)

const dbUrl = process.env.DB_URL

console.log(`Connecting ${dbUrl}`)

mongoose.connect( dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => {
    console.log(`Connected to DB ${result}`)
  })
  .catch((error) => {
    console.log(`Connection failed. ${error.message}`)
  })

const personSchema = new mongoose.Schema({
  name:{ type: String, minlength: 3 },
  number: { type:String, minlength: 8, unique: true }
})

personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)