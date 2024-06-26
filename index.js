const express = require('express')
const morgan = require('morgan')

morgan.token('resBody', function getBody(req) {
    return JSON.stringify(req.body)
})

const app = express()

app.use(express.json())
app.use(morgan(':method :url :response-time :resBody'))

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello world</h1>')
})

app.get('/api/persons', (request, response) => {
    console.log('showing persons')
    
    response.json(persons)
})


app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    console.log('id: ', id)
    
    const person = persons.find(person => person.id === Number(id))

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})


app.get('/info', (request, response) => {
    const date = new Date()
    console.log('Uusi ajankohta asetettu')
    
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>` )
})


app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    console.log('delete ', id)
    
    persons = persons.filter(person => person.id !== Number(id))

    response.status(204).end()
})

const generateId = () => {
    
    return Math.floor(Math.random()*100)
}

app.post('/api/persons', (request, response) => {
    
    const body = request.body

    if((!body.name) || (!body.number)) {
        return response.status(400).json({error: "name or number missing"})
    }

    if (persons.find(n => n.name === body.name )) {
        return response.status(400).json({errror: "name must be unique"})
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    persons = persons.concat(person)

    response.json(person)
})


const PORT = 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})