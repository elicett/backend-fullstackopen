/*Part 3, subpart a: Node.js and Express, Excercise 3.10: Backend in the phone book (step 10): Deploying at internet*/
const express = require('express')
const morgan = require("morgan")
const cors = require("cors")
const app = express()

app.use(express.json())
//app.use(morgan('tiny'))
app.use(cors());
app.use(express.static('dist'))

morgan.token('body', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body);
  }
  else if (req.method === 'GET' || req.method === 'DELETE') {
    return ''
  }
  else return 'Invalid Method';
});


app.use(morgan(':method :url :status :response-time ms :body', {}));



let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


/*
app.get('/', (request, response) => {
    return response.send('<h1>Hello World</h1>')
})
*/


app.get('/api/persons', (request, response) => {
    return response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person=> person.id === id)

    if (person) {
        return response.json(person)
    } else {
        return response.status(404).end('That contact doesnt exists')
    }
    
})

app.post('/api/persons', (request, response) => {
    const id = Math.random() * 1000000
    const newObject = {
        id: Math.trunc(id),
        name: request.body.name,
        number: request.body.number
    }
    if (!newObject.name || !newObject.number){
        return response.json({
            Error: 'You should fill both (name and number) fields',
        })
    }

    if (persons.find(value => value.name === newObject.name)){
        return response.status(409).json({
            Error: 'Contact already exists'
        })
    }

    persons = persons.concat(newObject);
    //console.log(newObject)
    return response.json({
        id: newObject.id,
        name: newObject.name,
        number: newObject.number,
    })
})


app.delete('/api/persons/:id', (request, response)=> {
  console.log('Contact to DELETE:', request)
  const id = Number(request.params.id)
  const contact = persons.find(value => value.id === id)

  if (!contact){
    return response.status(404).end('This contact doesnt exist')
  }

  persons = persons.filter(note => note.id !== id)

  return response.status(202).json({
    message: `Contact '${contact.name}' deleted correctly`,
    name: contact.name
    })
})


app.get('/info', (request, response)=>{
    const lengthPersons = persons.length
    const dateNow = new Date()
    return response.status(200).send(`
        <div>
            <p>Phonebook has info for ${lengthPersons} persons</p>
            <p>Request received at ${dateNow}</p>
        </div>
    `)
})

app.put('/api/persons/:id', (request, response) => {
  console.log('Contact to EDIT:', request)
  const id = Number(request.params.id)
  const contact = persons.find(value => value.id === id)

  if (!contact){
      return response.status(404).end('This contact doesnt exist')
  }


  console.log('Params:',request.params)
  console.log('Body:',request.body)
  contact.number = request.body.number
  

  return response.status(202).json({
    message: `Contact '${contact.name}' edited correctly`,
    id: contact.id,
    name: contact.name,
    number: contact.number
    })
})

const unknownEndpoint = (request, response) => {
  return response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

//const PORT = 3001
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})