const mongoose = require('mongoose')

const password = process.argv[2]
const dbName = 'test'
const name = process.argv[3]
const number = process.argv[4]

const personSchema = new mongoose.Schema( {
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)


const connectDb = (password, dbName) => {
  const dbUrl =
    `mongodb+srv://phonebook:${password}@cluster0.thsdr.mongodb.net/${dbName}?retryWrites=true&w=majority`
  return (
    mongoose.connect( dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  )
}

const getPersons = (password, dbName) => {
  connectDb(password, dbName)
  return(
    console.log('phonebook:'),
    Person.find({})
      .then(result => {
        result.forEach(person => {
          console.log(person.name, person.number)
        })
        mongoose.connection.close()
      })
  )
}

const addPerson = (password, dbName, name, number) => {
  const person = new Person({
    name: name,
    number: number
  })
  connectDb(password, dbName)
  return(
    person.save().then(response => {
      console.log(`Person ${response.name} with ${response.number} saved.`)
      mongoose.connection.close()
    })
  )
}

if (!process.argv[2]) {
  console.log('Give password as an argument...')
  process.exit(1)
}

if (process.argv.length === 3) {
  getPersons(password, dbName)
}

if (process.argv.length > 3) {
  addPerson(password, dbName, name, number)
}
