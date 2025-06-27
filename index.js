/*Part 3, subpart a: Node.js and Express, Excercise 3.6: Backend in the phone book (step 6): Conditionals (Missing name or number - The name already exists)-*/
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
    const id = Math.random() * 1000000
    const newObject = {
        id: Math.trunc(id),
        name: request.body.name,
        number: request.body.number
    }
    if (!newObject.name || !newObject.number){
        response.json({
            Error: 'You should fill both (name and number) fields',
        })
    }

    if (persons.find(value => value.name === newObject.name)){
        response.status(409).json({
            Error: 'Contact already exists'
        })
    }

    persons = persons.concat(newObject);
    console.log(newObject)
    response.json({
        message: 'Contact added',
        contact: newObject,
        entireData: persons
    })
})

app.delete('/api/persons/:id', (request, response)=> {
    const id = Number(request.params.id)
    const contact = persons.find(value => value.id === id)

    if (!contact){
        response.status(404).end('This contact doesnt exist')
    }


    persons = persons.filter(note => note.id !== id)



    response.status(202).json({
        message: `Contact '${contact.name}' deleted correctly`
        })
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