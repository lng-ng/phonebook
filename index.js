const express = require('express')
// const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))
const PORT = 3001

// morgan.token('content-size', (req, res) => {
//     return req.headers['content-length'] || 0
// })

// app.use(morgan(':method :url :status :content-size :response-time ms', {
//     skip: (req, _) => req.method !== 'POST'
// }))


let data = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


app.get('/api/persons', (request, response) => {
    response.json(data)
})

app.get('/info', (request, response) => {
    const now = new Date();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log(timezone);
    console.log(now.toLocaleString());
    response.send(
        `<p>Phonebook has info for ${data.length} people</p>
        <p>${now.toLocaleString()} ${timezone}</p>
        `
    )
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = data.find(item => item.id === id)
    if (person) {
        response.json(person)
    } 
    else {
        response.status(400).json({
            error: 'no such person'
        })
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    data = data.filter(item => item.id !== id)
    
    response.status(204).end()

})


app.post('/api/persons', (request, response) => {
    let id = null;
    while (id === null || data.find(item => item.id === id)) {
        id = Math.random() * 100;
    }
    if (request.body
        && request.body['name'] 
        && request.body['number'] 
    ) {
        if (data.find(item => item['name'] === request.body['name'])){
            response.status(400).json({
                error: "name must be unique"
            })
        }
        else {
            const newEntry = {
                ...request.body,
                id
            }
            data = data.concat(newEntry)
            response.json(newEntry)
        }
    }
    else {
        response.status(400).json({
            error: "invalid entry"
        })
    }   
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})