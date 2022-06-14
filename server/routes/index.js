const Router = require('express')
const router = new Router()
const postRouter = require('./posts.js')
const userRouter = require('./users.js')

router.use('/posts', postRouter)
router.use('/users', userRouter)

module.exports = router