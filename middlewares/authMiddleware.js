// This allows us to asynchronously respond to a request instead of callback
const asyncHandler = require('express-async-handler')

/**
 * Encrypts a path to allow only logged in user to access
 * @param {Object} req Request object by user
 * @param {Object} res Response object to request
 * @param {Function} next Moves on to next function in express chain
 */
const protect = asyncHandler(async (req, res, next) => {
  if (req.session.isAuth) {
    next()
  } else {
    res.status(401)
    res.redirect('/users/login')
  }
})

module.exports = protect
