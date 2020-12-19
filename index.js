const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

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
    name: "Mary Poppendieck",
    number: "39-23-6423122"
  }
]

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(x => x.id === id)

  if (!person) return res.status(404).end()

  res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(x => x.id !== id)

  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const person = req.body
  const newPersonId = Math.floor(Math.random() * (10**5))
  const isPersonAlreadyAdded = persons
    .find(x => x.name.toLowerCase() === person.name.toLowerCase())

  if (!person.name && !person.number) 
    return res.status(400).json({ error: 'content is missing' })
  if (!person.name) 
    return res.status(400).json({ error: 'name is missing' })
  if (!person.number)
    return res.status(400).json({ error: 'number is missing' })
  if (isPersonAlreadyAdded)
    return res.status(400).json({ error: 'person already added' })

  const newPerson = {
    id: newPersonId,
    name: person.name,
    number: person.number
  }
  
  persons = persons.concat(newPerson)
  res.json(person)
})

app.get('/info', (req, res) => {
  const msg = `
    <div>
      <p>
        Phonebook has info for ${ persons.length } people
      </p>
      <p>
        ${ new Date() }
      </p>
    </div>
  `

  res.send(msg)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${ PORT }`)
})
