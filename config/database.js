// mongoose is a connection api built over mongo db interface
// providing more features and ease of accessiblity
const mongoose = require('mongoose')
// Aesthic colors
const colors = require('colors')

/**
 * Connects to our mongo instance on ATLAS
 */
const connectDB = async () => {
  try {
    // Attempt connection
    const conn = await mongoose.connect(process.env.ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })

    console.log(colors.green.inverse(`MongoDB Connected: ${conn.connection.host}`))
  } catch (error) {
    console.error(colors.red(`Error: ${error.message}`))
    process.exit(1)
  }
}

/**
 * Returns data about session storage
 */
const getStore = () => ({
  uri: process.env.ATLAS_URI,
  collection: process.env.SESSION_COLL,
})

/**
 * Returns a session instance object for connection to session store
 * @param {Object} store Current Store instance
 */
const getSession = (store) => ({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  store,
})

module.exports = {
  connectDB,
  getSession,
  getStore,
}
