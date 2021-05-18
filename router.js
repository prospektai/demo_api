// Router imports
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const multer = require('multer')
const uploadImages = multer()

const router = express.Router()

// Import routes
const register = require('./routes/register.js')
const { login, renewJWT, verifyJWT } = require('./routes/login.js')
const view = require('./routes/vehicles/view.js')
const create = require('./routes/vehicles/create.js')
const add_images = require('./routes/images/add.js')
const count_images = require('./routes/images/count.js')

// Parse JSON requests,  and cookies
router.use(bodyParser.json({ limit: '2mb' }))
router.use(cookieParser())

// Route API calls
router.get('/', (req, res) => res.send('Service reachable'))

// Authentication
router.post('/auth/register', register)
router.post('/auth/login', login)

// JWT token control
router.post('/auth/renew', renewJWT)

//TEST
// router.post('/auth/verify', verifyJWT)

// View and create entries
router.post('/vehicles/view', verifyJWT, view)
router.post('/vehicles/create', verifyJWT, create)

// Get number of images in server for a specific vehicle UID
router.post('/images/count', verifyJWT, count_images)

// Upload images to an entry
router.post(
    '/vehicles/upload', 
    verifyJWT, 
    uploadImages.fields([{ name: 'photos', maxCount: 35 }, { name: 'background', maxCount: 1 }]), 
    add_images)

module.exports = router;