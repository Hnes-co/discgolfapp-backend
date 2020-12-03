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
        'unknown endpoint. Trying to route directly to a "subpage" of the page does not work. This is because they dont actually exist, since the page is a single page application. Remove the content after the "/" (example .com/courses) from the address bar to return to the page.' 
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