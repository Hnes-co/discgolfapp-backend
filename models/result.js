const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(result => {    
        console.log('connected to MongoDB')  
    })  
    .catch((error) => {    
        console.log('error connecting to MongoDB:', error.message)  
    })

const resultSchema = new mongoose.Schema({
  name: String,
  course: String,
  score: Number,
  toPar: Number,
})

resultSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Result', resultSchema)