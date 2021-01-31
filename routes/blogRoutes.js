// We will access router from here
const express = require('express')

const {
  getAllBlogs,
  blogDetails,
  createNewBlog,
  blogCreatePost,
  updateBlog,
  blogUpdate,
  blogDelete,
} = require('../controllers/blogController')

const protect = require('../middlewares/authMiddleware.js')

const upload = require('./uploadRoutes')

// Instance of sub router
const router = express.Router()

router
  .route('/create')
  .get(protect, createNewBlog)
  .post(protect, upload.single('image'), blogCreatePost)
router
  .route('/update/:id')
  .get(protect, updateBlog)
  .post(protect, upload.single('image'), blogUpdate)
router.route('/:id').get(blogDetails).post(protect, blogUpdate).delete(protect, blogDelete)
router.route('/').get(protect, getAllBlogs)

module.exports = router
