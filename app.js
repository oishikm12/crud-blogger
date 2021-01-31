// path is used to parse current dir with respect
// to file being executed
const path = require('path')

// We need express as a wrapper over https to handle
// incoming web requests
const express = require('express')
// session allows us to manage use login & auth
const session = require('express-session')

// We will use morgans to log our every move
const morgan = require('morgan')
// Merry coloring of console
const colors = require('colors')

// We need to store session data about user to mongo
const mongoSession = require('connect-mongodb-session')

// This allows us to pull environment variables into
// process.env global variable
require('dotenv').config()

// This will handle any unexpected event
const ON_DEATH = require('death')({ uncaughtException: true })

// These functions connect to our database
const { connectDB, getStore, getSession } = require('./config/database.js')

// These functions handle incorrect request
const { notFound, errorHandler } = require('./middlewares/errorMiddleware')

// These are the various routes which are accessible
const blogRoutes = require('./routes/blogRoutes')
const userRoutes = require('./routes/userRoutes')

// Creates an instane of express web server
const app = express()

// Connect to mongoDB
connectDB()

// Start a store for our mongo session
const MongoDBSession = mongoSession(session)
const store = new MongoDBSession(getStore())

// Connect session to express pipeline
app.use(session(getSession(store)))

// Register view engine for use with templating
app.set('view engine', 'ejs')

// Setting up additional middlewares
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(morgan('dev'))
app.use((req, res, next) => {
  res.locals.path = req.path
  next()
})

// Setting up actual routes to use
app.use('/blogs', blogRoutes)
app.use('/users', userRoutes)

app.get('/', (req, res) => res.redirect('/blogs'))

// Stray routes, should the user misstype
app.use(notFound)
app.use(errorHandler)

// Making the server listen to incoming requests
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(colors.blue(`Server running on `) + colors.blue.inverse(`http://localhost:${PORT}`))
})

// Handling unexpected crashes
ON_DEATH((signal, err) => {
  const crashed = typeof err !== 'string'

  if (crashed) {
    if (err.statusCode >= 500 || err.statusCode === 429) {
      // eslint-disable-next-line no-param-reassign
      delete err.body
    }

    console.log(colors.red.inverse(err))
  } else {
    console.log(colors.yellow.inverse(`Received kill signal "${signal}"`))
  }

  setTimeout(() => {
    process.exit(1)
  }, 1 * 1000)
})
