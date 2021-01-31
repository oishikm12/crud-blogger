/* eslint-disable func-names */
// Mongoose is a feature rich API over mongo driver
const mongoose = require('mongoose')
// Instance of Schema
const { Schema } = mongoose
// Cryptographic Hash Functionality
const bcrypt = require('bcryptjs')

const userSchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

userSchema.methods.matchPassword = async function (enteredPassword) {
  // Checks if hash of two passwords matches or not
  const matches = await bcrypt.compare(enteredPassword, this.password)
  return matches
}

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }

  // Arranges salt & generates md5 hash of password
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Creating User Instance
const User = mongoose.model('User', userSchema)
module.exports = User
