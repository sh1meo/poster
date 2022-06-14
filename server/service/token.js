const jwt = require('jsonwebtoken')
const { Tokens } = require('../models/models.js')

class TokenService {
    generateToken(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_KEY, {expiresIn: '30m'})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_KEY, {expiresIn: '30d'})
        return {accessToken, refreshToken}
    }

    //todo: тут надо допиливать логику, если зайти с другого устройства, с предыдущего выкинет т.к. токен может быть только один
    async saveToken(userId, refreshToken) {
        const tokensData = await Tokens.findOne({where: { userId }})
        if(tokensData) {
            tokensData.refreshToken = refreshToken
            await tokensData.save()
            return tokensData
        }
        const token = await Tokens.create({
            userId,
            refreshToken
        })
        return token
    }

    validateAccessToken(accessToken) {
        try {
            const userData = jwt.verify(accessToken, process.env.JWT_ACCESS_KEY)
            return userData
        } catch(e) {
            return null
        }
    }

    validateRefreshToken(refreshToken) {
        try {
            const userData = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY)
            return userData
        } catch(e) {
            return null
        }
    }

    async findRefreshToken(refreshToken) {
        const tokenFromDB = await Tokens.findOne({
            where: { refreshToken }
        })
        return tokenFromDB
    }

    async deleteToken(refreshToken) {
        const token = await Tokens.destroy({where: { refreshToken }})
        return token
    }
}

module.exports = new TokenService()