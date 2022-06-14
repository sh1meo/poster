const ApiError = require('../Error/ApiError.js')
const {Post} = require('../models/models.js')
const path = require('path')
const uuid = require('uuid')

class postController {
    async createPost(req, res, next) {
        const { title, text } = req.body
        const { img } = req.files

        try {
        let fileName = uuid.v4() + '.jpeg'
        img.mv(path.resolve(__dirname, '..', 'static', fileName))

        if(!title || !text) {
            return next(ApiError.BadRequest('title and text is required to fill out'))
        }
        const post = await Post.create({
            title,
            text,
            content: fileName,
            // author: 
        })
        return res.status(200).json({title: post.title, text: post.text, content: post.content})
        } catch(e) {
            return next(ApiError.BadRequest(e.message))
        }
    }

    async patchPost(req, res) {
        const { id } = req.query
        const { title, text } = req.body
        const { img } = req.files
        let fileName = uuid.v4() + '.jpeg'

        if(!id) {
            return next(ApiError.BadRequest('need post id'))
        }
        await Post.update({
            title,
            text,
            content
        },
        {
            where: { id }
        })
        return res.status(200).json({message: `post updated`})
    }

    async getPosts(req, res) {
        return res.status(200).json(await Post.findAll())
    }

    async getPostById(req, res, next) {
        const { id } = req.query
        if(!id) {
            return next(ApiError.BadRequest('need post id'))
        }
        return res.status(200).json(await Post.findByPk(id))
    }

    async deletePost(req, res) {
        const { id } = req.query
        if(!id) {
            return next(ApiError.BadRequest('need post id'))
        }
        Post.destroy({where: { id } })
        return res.status(200).json({message: 'post deleted'})
    }
}

module.exports = new postController()