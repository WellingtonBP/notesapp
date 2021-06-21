const router = require('express').Router()

const authController = require('../controllers/auth')
const mainController = require('../controllers/main')
const isLogged = require('../middlewares/isLogged')
const isLogout = require('../middlewares/isLogout')
const getUserNotes = require('../middlewares/getUserNotes')

//auth routes
router.get('/', isLogout, authController.getIndex)
router.post('/login', isLogout, authController.postLogin)
router.post('/signup', isLogout, authController.postSignup)
router.get('/logout', isLogged, authController.getLogout)

router.get('/workspace', isLogged, getUserNotes, mainController.getWorkspace)
router.route('/workspace/add')
   .post(isLogged, getUserNotes, mainController.postAddNote)
   .get(isLogged, getUserNotes, mainController.getAddNote)
router.post('/workspace/delete', isLogged, mainController.postDeleteNote)
router.post('/workspace/edit', isLogged, getUserNotes, mainController.postEditNote)


module.exports = router