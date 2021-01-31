// We will access router from here
const express = require('express')

const {
  authPage,
  authUser,
  signupPage,
  registerUser,
  authLogout,
} = require('../controllers/userController.js')

// Instance of sub router
const router = express.Router()

router.route('/').get(signupPage).post(registerUser)
router.route('/login').get(authPage).post(authUser)
router.route('/auth/logout').get(authLogout)

module.exports = router
