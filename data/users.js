// Bcrypt allows us to hash passwords into md5 format via given salt
const bcrypt = require('bcryptjs')

// Dummy Users
const users = [
  {
    name: 'Robin Doe',
    email: 'robin@example.com',
    password: bcrypt.hashSync('123456', 10),
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: bcrypt.hashSync('123456', 10),
  },
  {
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: bcrypt.hashSync('123456', 10),
  },
]

module.exports = users
