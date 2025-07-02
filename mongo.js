const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://elicett:${password}@cluster0.qsgkrho.mongodb.net/PhoneBook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const contactSchema = new mongoose.Schema({
    id: Number,
    name: String,
    number: String,
})

const Contact = mongoose.model('Contact', contactSchema)


if (process.argv.length===3){
  console.log('PhoneBook:')
  Contact.find({ }).then(result => {
    result.forEach(contact => {
      console.log(`${contact.name}: ${contact.number}`)
    })
    mongoose.connection.close()
  })
}
else if (process.argv.length===5){
  const contact = new Contact({
      name: process.argv[3],
      number: process.argv[4]
  })
  contact.save().then(result => {
  console.log(`Added ${contact.name} number ${contact.number} saved`)
  mongoose.connection.close()

  })
}
else {
  console.log(`Command not finded`)
  mongoose.connection.close()
}
