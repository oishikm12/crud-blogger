const path = require('path')

// Dealts with multi part form uploading, viz files
const multer = require('multer')

// Copies & Renames a file to upload
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'public/assets/Blog-post/')
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
  },
})

// Ensures that only images are stored on server
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)

  if (extname && mimetype) {
    return cb(null, true)
  }
  return cb(new Error('Images only!'))
}

// Extracts image from express chain
const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    console.log(req)
    checkFileType(file, cb)
  },
})

module.exports = upload
