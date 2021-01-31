// This allows asynchronous wrapping of response request instance
const asyncHandler = require('express-async-handler')

// Mongoose model of a blog
const Blog = require('../models/blogModel')

/**
 * Fetches all blogs from database
 * @method GET
 * @access Public
 */
const getAllBlogs = asyncHandler(async (req, res) => {
  // Size of page
  const pageSize = 5
  const page = Number(req.query.page) || 1

  // Specific category scanning
  const { category } = req.query

  // Specific Record searching
  const keyword = req.query.keyword
    ? {
        title: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {}

  let count
  let blogs

  if (category) {
    // We find a document matching this category
    count = await Blog.countDocuments({ category })
    // We limit to page size, with pagination & reverse chronological sort order
    blogs = await Blog.find({ category })
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
  } else {
    // We find a document matching this keyword, could be empty too for all
    count = await Blog.countDocuments({ ...keyword })
    // We limit to page size, with pagination & reverse chronological sort order
    blogs = await Blog.find({ ...keyword })
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
  }

  // We map each occurance of categories
  const categoryBlog = await Blog.find({})
  const categories = {}

  for (let i = 0; i < categoryBlog.length; i += 1) {
    categories[categoryBlog[i].category] = categories[categoryBlog[i].category]
      ? categories[categoryBlog[i].category] + 1
      : 1
  }

  // The latest 6 get to be featured on top
  const topFeatured = await Blog.find({}).sort({ createdAt: -1 }).limit(6)

  res.render('index', {
    blogs,
    page,
    categories,
    topFeatured,
    pages: Math.ceil(count / pageSize),
    isAuth: req.session ? req.session.isAuth : false,
    uName: req.session ? req.session.uName : '',
    uId: req.session ? req.session.uId : '',
    title: 'Welcome',
  })
})

/**
 * Finds a single specific blog page
 * @method GET
 * @access Public
 */
const blogDetails = asyncHandler(async (req, res) => {
  // Finding if a blog with the id exisits or not
  const { id } = req.params
  const blog = await Blog.findById(id)

  if (blog) {
    res.render('details', {
      blog,
      title: 'Blog Details',
      uName: req.session ? req.session.uName : '',
      uId: req.session ? req.session.uId : '',
      isAuth: req.session ? req.session.isAuth : false,
    })
  } else {
    res.status(404)
    throw new Error('No Blogs Found')
  }
})

/**
 * Add Blog Page
 * @method GET
 * @access Private
 */
const createNewBlog = (req, res) => {
  // Page for creation of blog
  res.render('create', {
    title: 'Create a new blog',
    uName: req.session ? req.session.uName : '',
    uId: req.session ? req.session.uId : '',
    isAuth: req.session ? req.session.isAuth : false,
  })
}

/**
 * Creates a new Blog Post
 * @method POST
 * @access Private
 */
const blogCreatePost = asyncHandler(async (req, res) => {
  // File Path will contain addon, as well as unix style slashes
  req.body.image = req.file.path.substring(6).replaceAll('\\', '/')

  // We save a new blog file
  const blog = new Blog({
    ...req.body,
    user: req.session ? req.session.uId : '',
    name: req.session ? req.session.uName : '',
  })
  const createdPost = await blog.save()
  if (createdPost) res.redirect('/blogs')
})

/**
 * Update Blog Page display
 * @method GET
 * @access Private
 */
const updateBlog = asyncHandler(async (req, res) => {
  // Which blog to update
  const { id } = req.params
  const blog = await Blog.findById(id)

  if (String(blog.user) === String(req.session.uId))
    res.render('update', {
      title: 'Update a new blog',
      blog,
      uName: req.session ? req.session.uName : '',
      uId: req.session ? req.session.uId : '',
      isAuth: req.session ? req.session.isAuth : false,
    })
  else res.redirect(`/blogs/${id}`)
})

/**
 * Update Blog Post backend
 * @method POST
 * @access Private
 */
const blogUpdate = asyncHandler(async (req, res) => {
  // Finds out blog to update
  const { body } = req
  const { id } = req.params
  const blog = await Blog.findById(id)

  // Changes accoridng to daya provided
  if (blog) {
    blog.title = body.title ? body.title : blog.title
    blog.snippet = body.snippet ? body.snippet : blog.snippet
    blog.category = body.category ? body.category : blog.category
    blog.body = body.body ? body.body : blog.body
    blog.image = req.file ? req.file.path.substring(6).replaceAll('\\', '/') : blog.image

    await blog.save()
    res.redirect(`/blogs/${id}`)
  } else {
    res.status(404)
    throw new Error('Blog not found')
  }
})

/**
 * Delete Blog Post database request
 * @method DELETE
 * @access Private
 */
const blogDelete = asyncHandler(async (req, res) => {
  // Finds out if post exists
  const { id } = req.params
  const blog = await Blog.findById(id)

  // Since both IDS are objects, we typecast to string
  if (blog && String(blog.user) === String(req.session.uId)) {
    await blog.remove()
  } else {
    res.status(404)
    throw new Error('Blog not found')
  }
})

module.exports = {
  getAllBlogs,
  blogDetails,
  createNewBlog,
  blogCreatePost,
  updateBlog,
  blogUpdate,
  blogDelete,
}
