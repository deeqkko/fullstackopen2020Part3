const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(morgan(':method :url :status - :response-time ms :content'))

morgan.token('content', (request, response) => {
    return JSON.stringify(request.body)
})


var fs = require("fs")
var persons = (JSON.parse(fs.readFileSync("db.json", "utf-8"))).persons

const infoPage = (persons) => {
    const now = new Date();
    return(
        `<p>Phonebook has ${persons.length} persons.</p>
        <p>${now}</p>`
    )
}

const generateId = () => {
    const newId = Math.round(Math.random() * 100)
    const id = persons.find(person => person.id === newId)
    let result = null
    while (id === newId) { newId = Math.round(Math.random() * 100)}
    return newId
}

const writeToFile = (persons, fs) => {
    toFile = JSON.stringify({
        persons: persons
    })
    fs.writeFile('db.json', toFile, 'utf-8', (error) => {
        if (error) { return console.log('Write error')}
        else { return  0 // console.log('Write success')
    }
    })
}

app.get('/', (request, response) => {
    response.send('<h1>Hello there!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person =>
        person.id === id)
    
    person ? response.json(person) : response.status(404).end()
})

app.post('/api/persons', (request, response) => {
    const content = request.body
    const names = persons.find(person => person.name === content.name)
    if (!content) {
        return response.status(400).json({
            error: 'Content missing'
        })
    }

    if (!content.name) {
        return response.status(400).json({
            error: 'Name field missing'
        })
    }

    if (names) {
        return response.status(400).json({
            error: 'Duplicate name'
        })
    }

    const person = {
        id: generateId(),
        name: request.body.name,
        number: request.body.number
    }
    
    persons = persons.concat(person)
    writeToFile(persons, fs)
    return response.status(200).end()
    
    
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    persons = persons.filter(person => person.id !== id)
    
    //console.log(person)
    writeToFile(persons, fs)

    person 
        ? response.status(204).end() 
        : response.status(404).end()
    
})

app.get('/info', (request, response) => {
    response.send(infoPage(persons))
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Listening port ${PORT}`)
})