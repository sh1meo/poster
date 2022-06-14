const { User } = require('../models/models.js')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const MailService = require('./mail.js')
const TokenService = require('./token.js')
const UserDto = require('../dtos/user.js')
const user = require('../controllers/user.js')

class UserService {
    async registrationUser(email, password, username) {
        const candidateEmail = await User.findOne({
            where: { email }
        })

        const candidateUsername = await User.findOne({
            where: { username }
        })

        if(candidateEmail) {
            throw new Error(`Пользователь с email ${email} уже существует`)
        }

        if(candidateUsername) {
            throw new Error(`Пользователь с никнеймом ${username} уже существует`)
        }

        const hashPassword = await bcrypt.hash(password, 3)

        const activatorLink = uuid.v4()

        const createdUser = await User.create({
            email,
            password: hashPassword,
            activatorLink,
            username
        })

        //передаём в сервис почту нового юзера и гуид, который подставляется в ссылку
        await MailService.sendActivatorMail(email, activatorLink)

        // UserDto ожидает model с { email, id, activated, username }
        const userDto = new UserDto(createdUser)

        const tokens = TokenService.generateToken({...userDto})

        await TokenService.saveToken(userDto.id, tokens.refreshToken)

        return {...tokens, user: userDto}
    }

    async loginUser(email, password) {
        const user = await User.findOne({ where: {email} })
        if(!user) {
            throw new Error('Пользователь с таким email не найден')
        }
        const isPassCorrect = await bcrypt.compare(password, user.password)

        if(!isPassCorrect) {
            throw new Error('Неверный пароль')
        }

        const userDto = new UserDto(user)

        const tokens = TokenService.generateToken({...userDto})

        await TokenService.saveToken(userDto.id, tokens.refreshToken)

        return {...tokens, user: userDto}
    }

    async refreshUser(refreshToken) {

        if(!refreshToken) {
            throw new Error('where is your token?')
        }

        //достаю данные из токена через jwt.verify
        const userData = TokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await TokenService.findRefreshToken(refreshToken)

        if(!userData || ! tokenFromDb) {
            throw new Error('token not found')
        }

        const user = await User.findByPk(userData.id)
        const userDto = new UserDto(user)

        const tokens = TokenService.generateToken({...userDto})

        await TokenService.saveToken(userDto.id, tokens.refreshToken)

        return {...tokens, user: userDto}
    }

    async logoutUser(refreshToken) {
        const token = await TokenService.deleteToken(refreshToken)
        return token
    }

    async activateUser(activatorLink) {
        const user = await User.findOne({where: { activatorLink }})
        if(!user) {
            throw new Error('Некорректная ссылка для активации')
        }
        user.activated = true;
        await user.save()
    }

    async resendLink(email) {
        const user = await User.findOne({where: { email }})
        if(!user) {
            throw new Error('Пользователь с таким email не найден')
        }
        await MailService.sendActivatorMail(email, user.activatorLink)
    }
}

module.exports = new UserService()