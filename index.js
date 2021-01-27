require('dotenv').config()
const { response, request } = require('express')
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Course = require('./models/result')

app.use(express.json()) 

app.use(express.static(path.join(__dirname, 'build')))
app.use(cors())
app.use(morgan('tiny'))


app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/courses', (req, res) => {
    Course.find({}).then(courses => {
        res.json(courses)
    })
})

app.get('/api/courses/:id', (req, res, next) => {
    Course.findById(req.params.id).then(course => {
        if(course) {
            res.json(course)
        }
        else {
            res.status(404).end()
        }
    })
    .catch(error => next(error))
})

app.get('/courses', (req, res) => {
    res.send(`
        <h1>Oops!</h1>
        <p> You tried to reach a page that doesn't exist. </p>
        <p> Since this is a single page application, the "subpages" ( /course, /links, /scrores) do not actually exist.</p>
        <p> To avoid this error, do not refresh the page while browsing the "subpages"</p>
        <p> Remove the content after the "/" (example: www.samplepage.com/courses <-- ) from the address bar to return to the home page</p>
        <p> Yes, this is a poor way of handling this error, and hopefully someday these requests will redirect back to the home page....</p>
    `)
})

app.get('/scores', (req, res) => {
    res.send(`
        <h1>Oops!</h1>
        <p> You tried to reach a page that doesn't exist. </p>
        <p> Since this is a single page application, the "subpages" ( /course, /links, /scrores) do not actually exist.</p>
        <p> To avoid this error, do not refresh the page while browsing the "subpages"</p>
        <p> Remove the content after the "/" (example: www.samplepage.com/courses <-- ) from the address bar to return to the home page</p>
        <p> Yes, this is a poor way of handling this error, and hopefully someday these requests will redirect back to the home page....</p>
    `)
})


app.get('/links', (req, res) => {   
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
  })

  
app.post('/api/courses', (request, response) => {
    const body = request.body
  
    if (body.name === undefined) {
        return response.status(400).json({ 
            error: 'name missing' 
        })
    }
  
    const course = new Course ({
        name: body.name,
        parTotal: body.parTotal,
        holes: body.holes,
        results: body.results,
    })
  
    course.save().then(savedCourse => {
        response.json(savedCourse)
    })
})

app.put('/api/courses/:id', (request, response, next) => {
    const body = request.body

    const course = {
        name: body.name,
        parTotal: body.parTotal,
        holes: body.holes,
        results: body.results,
    }

    Course.findByIdAndUpdate(request.params.id, course, {new: true})
        .then(updatedCourse => {
            response.json(updatedCourse)
        })
        .catch(error => next(error))
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