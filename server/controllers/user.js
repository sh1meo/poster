const ApiError = require('../Error/ApiError.js')
const { User, Post } = require('../models/models.js')
const UserService = require('../service/user.js')
const { validationResult } = require('express-validator')

class userController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                throw new Error('Логин или пароль введены некорректно')
            }
            const { email, password, username } = req.body
            const userData = await UserService.registrationUser(email, password, username)
            
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true
            })

            return res.json(userData)
        } catch(e) {
            next(ApiError.BadRequest(e.message))
        }
    }

    async login(req, res, next) {
        try {
            //todo: добавить возможность логиниться через юзернейм
            const { email, password } = req.body
            const userData = await UserService.loginUser(email, password)
            if(!userData) {
                throw new Error('Неверный логин или пароль')
            }

            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true
            })

            return res.json({message: 'login successful', userData})
        } catch(e) {
            next(ApiError.BadRequest(e.message))
        }
    }

    async auth(req, res) {
        res.json({message: `privet`})
    }

    async logoutUser(req, res, next) {
        const { refreshToken } = req.cookies
        const token = await UserService.logoutUser(refreshToken)
        res.clearCookie('refreshToken')
        return res.json({message: `user with token ${token} logout`})
    }

    async activate(req, res, next) {
        try {
        const link = req.params.link
        await UserService.activateUser(link)
        return res.json({message: 'ok'})
        } catch(e) {
            next(ApiError.BadRequest(e.message))
        }
    }

    async refresh(req, res, next) {
        try{
        const { refreshToken } = req.cookies
        const userData = await UserService.refreshUser(refreshToken)
        res.cookie('refreshToken', userData.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true
            })
        } catch(e) {
            next(ApiError.forbidden(e.message))
        }
    }

    async getUser(req, res, next) {
        try {
            const users = await User.findAll()
            return res.json({user: req.user, users})
        } catch(e) {
            next(ApiError.BadRequest(e.message))
        }
    }

    async resendLink(req, res, next) {
        const email = req.body
        try {
            await UserService.resendLink(email)
            return res.json({message: 'link re-sended'})
        } catch(e) {
            next(ApiError.BadRequest(e.message))
        }
    }
}

module.exports = new userController()