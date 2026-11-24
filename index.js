require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Entry = require('./modules/phonebook')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(express.static('dist'))
app.use(cors())

const PORT = process.env.PORT


morgan.token('content-size', (req) => {
  return req.headers['content-length'] || 0
})

app.use(morgan(':method :url :status :content-size :response-time ms', {
  skip: (req) => req.method !== 'POST'
}))



app.get('/api/persons', (request, response) => {
  Entry.find({}).then(result => {
    response.json(result)
  })
    .catch(error => console.log(error.message))
})

app.get('/info', (request, response) => {
  const now = new Date()
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  Entry.find({}).then(result => {
    const info = 
      `<p>Phonebook has info for ${result.length} people</p>
        <p>${now.toLocaleString()} ${timezone}</p>
        `
    response.send(info)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Entry.findById(id).then(person => {
    if (person) {
      response.json(person)
    }
    else {
      response.status(400).json({
        error: 'no such person'
      })
    }

  })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Entry.findByIdAndDelete(id).then(person => {
    if (person) {
      response.json(person)
    }
    else {
      response.status(400).json({
        error: 'no such person'
      })
    }
  })
    .catch(error => next(error))

})

app.put('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Entry.findByIdAndUpdate({_id: id}, {number: request.body['number']}, {returnDocument: 'after', runValidators: true})
    .then(person => {
      if (person) {
        response.json(person)
      }
      else {
        response.status(400).json({
          error: 'no such person'
        })
      }
    })
    .catch(error => next(error))
})


app.post('/api/persons', (request, response, next) => {
  const name = request.body['name']
  Entry.findOne({name}).then(person => {
    if (person) {
      response.status(400).json({
        error: 'name must be unique'
      })
    }
    else {
      const newEntry = new Entry({
        ...request.body
      })
      newEntry.save()
        .then(savedEntry => {
          response.json(savedEntry)
        })
        .catch(error => {
          return next(error)
        })
    }
  })
    .catch(error => next(error))
    
})




app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


const errorHandler = (error, request, response) => {
  if (error.name === 'CastError') {
    response.status(400).json({
      error: 'invalid id',
      name: error.name
    })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({error: error.message, name: error.name})
  }

  return response.status(500).json({
    error: 'internal server error'
  })
}
app.use(errorHandler)