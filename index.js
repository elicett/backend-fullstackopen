/*Part 3, subpart a: Node.js and Express, Excercise 3.3: Backend in the phone book (step 3): Show specific contact with handle to non-existent data*/
const express = require('express')
const app = express()

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

app.use(express.json())

app.get('/', (request, response) => {
    response.send('<h1>Hello World</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person=> person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end('That contact doesnt exists')
    }
    
})

app.post('/api/persons', (request, response) => {
    const persons = request.body
    console.log(persons)
    response.json(persons)
})

app.delete('/api/persons/:id', (request, response)=> {
    const id = Number(request.params.id)
    persons = persons.filter(note => note.id !== id)
    response.status(204).end()
})


app.get('/info', (request, response)=>{
    const lengthPersons = persons.length
    const dateNow = new Date()
    response.status(200).send(`
        <div>
            <p>Phonebook has info for ${lengthPersons} persons</p>
            <p>Request received at ${dateNow}</p>
        </div>
    `)
})





const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})