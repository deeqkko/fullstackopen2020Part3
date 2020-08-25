const mongoose = require('mongoose')

const dbUrl = process.env.DB_URL

console.log(`Connecting ${dbUrl}`)

mongoose.connect( dbUrl, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(result => {
        console.log(`Connected to DB`)
    })
    .catch((error) => {
        console.log(`Connection failed. ${error.message}`)
    })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)