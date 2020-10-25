const express = require('express')
// const morgan = require('morgan');
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})

app.get('/info', (request, response) => {
  const d = new Date(Date.now())

  Person.find({}).then((result) => {
    response.send(
      `<p>Phonebook has info for ${result.length} people</p><p>${d}</p>`,
    )
  })
})

app.post('/api/persons', (request, response, next) => {
  const { body } = request

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person
    .save()
    .then((savedPerson) => {
      console.log(savedPerson)
      return savedPerson.toJSON()
    })
    .then((saveAndFormattedPerson) => {
      response.json(saveAndFormattedPerson)
    })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { body } = request

  console.log('body is: ', body)
  console.log('request.params.id', request.params.id)

  const person = {
    name: body.name,
    number: body.number,
  }
  console.log('person object:  ', person)

  Person.findByIdAndUpdate(
    request.params.id,
    { number: person.number },
    { runValidators: true, context: 'query', new: true },
  )
    .then((updatedPerson) => {
      console.log('Updated person', updatedPerson)
      response.json(updatedPerson)
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  return next(error)
}

app.use(errorHandler)

const { PORT } = process.env
app.listen(PORT, () => {
  console.log(`Server runnig on port ${PORT}`)
})

/*

app.use(express.json())

let persons = [
  {
    name: 'Arto Hellas',
    number: '040-123456',
    id: 1,
  },
  {
    name: 'Ada Lovelace',
    number: '39-44-5323523',
    id: 4,
  },
  {
    name: 'Dan Abramov',
    number: '12-43-234345',
    id: 3,
  },
  {
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
    id: 5,
  },
]

let amountPersons = persons.length

const generateId = () => {
  //const maxId = persons.length > 0 ? Math.max(...persons.map((p) => p.id)) : 0
  //return maxId + 1
  return Math.floor(Math.random() * 10000000000000)
}

app.get('/info', (req, res) => {
  res.send(`<p>Phonebook has info for ${amountPersons} people</p><p>${d}</p>`)
})

morgan.token('body', function (req, res) {
  return JSON.stringify(req.body)
})

const loggerFormat =
  ':method :url :status :res[content-length] - :response-time ms :body'

app.use(
  morgan(loggerFormat, {
    skip: function (req, res) {
      return req.method !== 'POST'
    },
    stream: process.stdout,
  })
)

app.use(
  morgan('tiny', {
    skip: function (req, res) {
      return req.method === 'POST'
    },
    stream: process.stdout,
  })
)
*/
