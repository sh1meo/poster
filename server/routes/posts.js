const Router = require('express')
const router = new Router()
const postController = require('../controllers/post.js')

router.post('/', postController.createPost)
router.get('/', postController.getPosts),
router.get('/id', postController.getPostById),
router.delete('/id', postController.deletePost),
router.patch('/id', postController.patchPost)

module.exports = router