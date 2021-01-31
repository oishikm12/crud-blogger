// Aesthetic console
const colors = require('colors')

// Allows database connectivity
const { connectDB } = require('./config/database')

// Spam data to fill the space
const blogDump = require('./data/blogs')
const userDump = require('./data/users')

// Mongo Models of data
const Blog = require('./models/blogModel')
const User = require('./models/userModel')

// Pulls in environment variables into process.env
require('dotenv').config()

// Connect to database
connectDB()

/**
 * Imports data into Mongo Atlas Database
 */
const importData = async () => {
  try {
    // Delete existing data if any
    await Blog.deleteMany()
    await User.deleteMany()
    console.log(colors.red('Pre-existing Data Removed'))

    // Add new user data
    const createdUsers = await User.insertMany(userDump)

    const sampleBlogs = blogDump.map((blog, i) => {
      // For every blog, we add a unique owner and their name to it
      const userId = createdUsers[i % createdUsers.length]._id
      const userName = createdUsers[i % createdUsers.length].name

      return { ...blog, user: userId, name: userName }
    })

    // Add new blogs
    await Blog.insertMany(sampleBlogs)

    console.log(colors.green.inverse('Data Imported!'))
    process.exit()
  } catch (error) {
    console.error(colors.red.inverse(`${error}`))
    process.exit(1)
  }
}

/**
 * Removes all pre-existing data without replacement
 */
const destroyData = async () => {
  try {
    // Delete existing data if any
    await Blog.deleteMany()
    await User.deleteMany()
    console.log(colors.red('Pre-existing Data Removed'))

    process.exit(0)
  } catch (error) {
    console.error(colors.red.inverse(`${error}`))
    process.exit(1)
  }
}

// This script can be called with an additional parameter
// in order to decide if we want to replace deleted data
// or just add data
if (process.argv[2] === '-d') destroyData()
else importData()
