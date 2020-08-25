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


var fs = require("fs")
const { request } = require('express')
var persons = (JSON.parse(fs.readFileSync("db.json", "utf-8"))).persons

const infoPage = (persons) => {
    const now = new Date();
    return(
        `<p>Phonebook has ${persons.length} persons.</p>
        <p>${now}</p>`
    )
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
    .catch((error) => {
        console.log(`Not found ${error}`)
    })
    
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(result => {
        console.log(result)
        response.json(result)
    })
})

app.post('/api/persons', (request, response) => {
    const content = request.body
    Person.find(content).then(result => {
        if (!content.name) {
            return response.status(400).json({
                error: 'Name field missing'
            })
        }
        let names = []
        result.forEach(name => {
            names.push(name)
            //console.log(result)
        })
        if (names.length !== 0) {
            console.log(names.length)
            return response.status(400).json({
                error: 'Duplicate name'
            })
        }
        
        const person = new Person({
            name: content.name,
            number: content.number
        })

        person.save().then(savedPerson => {
            response.status(200).json(savedPerson).end()
        })
        
    })
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
    
})

app.get('/info', (request, response) => {
    response.send(infoPage(persons))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Listening port ${PORT}`)
})