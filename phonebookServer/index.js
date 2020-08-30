require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')


app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status - :response-time ms :content'))

morgan.token('content', (request, response) => {
  return JSON.stringify(request.body)
})


const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return response.status(404).send({ error:'Incorrect id format' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json( { error: error })
  }

  next(error)
}


app.get('/', (request, response) => {
  response.send('<h1>Hello there!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({})
    .then(result => {
      result.forEach(person => {
        console.log(person)
      })
      response.json(result)
    })
    .catch(error => next(error))

})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(result => {
      console.log(result)
      response.json(result)
    })
    .catch(error => next(error))
})

app.use(errorHandler)

app.put('/api/persons/:id', (request, response) => {
  const update = {
    number: request.body.number
  }

  Person.findByIdAndUpdate(request.params.id, update, { new: 'true' })
    .then(updatePerson => {
      response.json(updatePerson)
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const content = request.body
  Person.find(content)
    .then(result => {
      if (!content.name) {
        return response.status(400).json({
          error: 'Name field missing'
        })
      }
      // let names = []
      // result.forEach(name => {
      //     names.push(name)
      //     //console.log(result)
      // })
      // if (names.length !== 0) {
      //     console.log(names.length)
      //     return response.status(400).json({
      //         error: 'Duplicate name'
      //     })
      // }

      const person = new Person({
        name: content.name,
        number: content.number
      })

      person.save()
        .then(savedPerson => {
          response.status(200).json(savedPerson).end()
        })
        .catch(error => next(error))


    })

})

app.use(errorHandler)



app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.get('/info', (request, response) => {
  const now = new Date()
  Person.countDocuments({})
    .then(result =>
      response.send(
        `<p>The phonebook has ${result} persons <p>${now}`
      ))
    .catch(error => next(error))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Listening port ${PORT}`)
})