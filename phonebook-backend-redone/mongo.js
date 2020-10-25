const mongoose = require('mongoose')

const password = process.argv[2]
const newName = process.argv[3]
const newNumber = process.argv[4]

// const url = `mongodb+srv://fullstack:${password}@cluster0-aioxz.mongodb.net/phonebook-app?retryWrites=true`
const url = `mongodb+srv://qbanor:${password}@cluster0.3fzty.mongodb.net/phonebook-app?retryWrites=true`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const savePerson = (name, number) => {
  const person = new Person({
    name,
    number,
  })

  person.save().then((result) => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  })
}

const listAll = () => {
  Person.find({}).then((result) => {
    console.log('phonebook:')
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}

if (process.argv.length < 3) {
  console.log(
    'Please provide the password as an argument: node mongo.js <password>',
  )
  process.exit(1)
} else if (process.argv.length === 3) {
  listAll()
} else if (process.argv.length === 5) {
  savePerson(newName, newNumber)
}
