require('dotenv').config()
const { response, request } = require('express')
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Result = require('./models/result')

app.use(express.json()) 

app.use(express.static('build'))
app.use(cors())
app.use(morgan('tiny'))


app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/results', (req, res) => {
    Result.find({}).then(results => {
        res.json(results)
    })
})

app.get('/api/results/:id', (req, res, next) => {
    Result.findById(req.params.id).then(result => {
        if(result) {
            res.json(result)
        }
        else {
            res.status(404).end()
        }
    })
    .catch(error => next(error))
})

app.get('/courses', (req, res) => {
    res.sendFile(path.join(__dirname, './build/index.html'))
})
app.get('/scores', (req, res) => {
    res.sendFile(path.join(__dirname, './build/index.html'))
})
app.get('/links', (req, res) => {
    res.sendFile(path.join(__dirname, './build/index.html'))
})

  
app.post('/api/results', (request, response) => {
    const body = request.body
  
    if (body.name === undefined) {
        return response.status(400).json({ 
            error: 'name missing' 
        })
    }
  
    const result = new Result ({
        name: body.name,
        course: body.course,
        score: body.score
    })
  
    result.save().then(savedResult => {
        response.json(savedResult)
    })
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 
        'unknown endpoint. you tried to reach a page that does not exist.'
    })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    }
  
    next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})