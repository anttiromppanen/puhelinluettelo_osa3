const mongoose = require('mongoose')

const pw = process.argv[2]
const dbName = 'notebook-app'
const url = `mongodb+srv://ana:${ pw }@cluster0.zzw3l.mongodb.net/${ dbName }?retryWrites=true&w=majority`

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const listPersonsHelper = () => {
  console.log('phonebook:')
  Person.find({}).then(res => {
    res.forEach(person => {
      console.log(person.name, person.number)
    })

    mongoose.connection.close()
  })
}

const addPersonHelper = () => {
  const newName = process.argv[3]
  const newNumber = process.argv[4]

  const newPerson = new Person({
    name: newName,
    number: newNumber,
  })

  newPerson.save().then(res => {
    console.log(`Added ${ newName } number ${ newNumber } to phonebook`)
    mongoose.connection.close()
  })
}

if (process.argv.length === 3) {
  listPersonsHelper()
} else if (process.argv.length === 5) {
  addPersonHelper()
} else {
  console.log('unknown command')
  mongoose.connection.close()
}
