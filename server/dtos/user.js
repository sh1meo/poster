module.exports = class UserDto {
    email
    id
    activated
    username

    constructor(model) {
        this.email = model.email
        this.id = model.id
        this.activated = model.activated
        this.username = model.username
    }
}