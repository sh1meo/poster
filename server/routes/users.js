const Router = require('express')
const router = new Router()
const userController = require('../controllers/user.js')
const {body} = require('express-validator')
const authMiddleware = require('../middleware/AuthMiddleware')

/** 
 * @reqBody {string} email
 * @reqBody {string} password
 * @reqBody {string} username
 * @resBody {string} возвращает ссылку-guid 
*/
router.post('/registration', 
body('email').isEmail(),
body('password').isLength({min: 5, max: 10}),
userController.registration)

/** 
 * @reqBody {string} email
 * @reqBody {string} password
*/ 
router.post('/login', userController.login)

router.post('/refresh', userController.refresh)

//принимает только куку, удаляет её
router.post('/logout', userController.logoutUser)

// router.get('/auth', userController.auth)

/**
 * @param {string} link
 * @res message: 'ok'
 */
router.post('/activate/:link', userController.activate)

//отправляет ссылку повторно если что-то помешало отправке при регистрации
//или юзер потерял письмо
router.post('/resendLink', userController.resendLink)

// router.get('/refresh', userController.refresh)

//возвращает всех юзеров в формате users: {users}
router.get('/', 
authMiddleware,
userController.getUser)

module.exports = router