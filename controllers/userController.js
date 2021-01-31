// This allows asynchronous wrapping of response request instance
const asyncHandler = require('express-async-handler')

// Mongoose model of a blog
const User = require('../models/userModel.js')

/**
 * Renders login Page
 * @method GET
 * @access Public
 */
const authPage = asyncHandler(async (req, res) => {
  res.render('login', {
    title: 'Login',
    uName: req.session ? req.session.uName : '',
    uId: req.session ? req.session.uId : '',
    isAuth: req.session ? req.session.isAuth : false,
  })
})

/**
 * Authenticates a user
 * @method POST
 * @access Public
 */
const authUser = asyncHandler(async (req, res) => {
  // Extracts provided user email & password
  const { email, password } = req.body

  // Find a specific user
  const user = await User.findOne({ email })

  if (user && (await user.matchPassword(password))) {
    req.session.isAuth = true
    req.session.uId = user._id
    req.session.uName = user.name
    res.status(200)
    res.redirect('/')
  } else {
    res.status(401)
    res.redirect('/users/login')
  }
})

/**
 * Rendering a Sign Up Page
 * @method GET
 * @access Public
 */
const signupPage = asyncHandler(async (req, res) => {
  res.render('signup', {
    title: 'Sign Up',
    uName: req.session ? req.session.uName : '',
    uId: req.session ? req.session.uId : '',
    isAuth: req.session ? req.session.isAuth : false,
  })
})

/**
 * Saving of new record to datbase
 * @method POST
 * @access Public
 */
const registerUser = asyncHandler(async (req, res) => {
  // New user data registration
  const { name, email, password } = req.body

  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    res.redirect('/')
  }

  // User Authentication & Login
  const user = await User.create({
    name,
    email,
    password,
  })

  if (user) {
    req.session.isAuth = true
    req.session.uName = user.name
    req.session.uId = user.id
  } else {
    res.status(400)
    res.redirect('/users/login')
  }
})

/**
 * Logout redirection
 * @method POST
 * @access Protected
 */
const authLogout = asyncHandler(async (req, res) => {
  const destroy = await req.session.destroy()

  if (!destroy) throw Error('Could not destroy session')

  res.redirect('/users/login')
})

module.exports = {
  authPage,
  authUser,
  signupPage,
  registerUser,
  authLogout,
}
