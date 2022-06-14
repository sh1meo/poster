const ApiError = require("../Error/ApiError")
const TokenService = require('../service/token.js')

module.exports = function(req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization
        if(!authorizationHeader) {
            return next(ApiError.forbidden('Empty authorization header'))
        }

        const accessToken = authorizationHeader.split(" ")[1]
        if(!accessToken) {
            return next(ApiError.forbidden('Access token not found'))
        }

        const userData = TokenService.validateAccessToken(accessToken)
        if(!userData) {
            return next(ApiError.forbidden('Invalid access token'))
        }

        req.user = userData
        next()
    } catch(e) {
        return next(ApiError.forbidden('authorization error'))
    }
}