const sequelize = require('../db.js')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, defaultValue: 'user'},
    username: {type: DataTypes.STRING, unique: true},
    activated: {type: DataTypes.BOOLEAN, defaultValue: false},
    activatorLink: {type: DataTypes.STRING}
})

const Post = sequelize.define('post', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, allowNull: false},
    text: {type: DataTypes.STRING, allowNull: false},
    content: {type: DataTypes.STRING, defaultValue: null},
    author: {type: DataTypes.STRING}
})

const Tokens = sequelize.define('tokens', {
    userId: {type: DataTypes.INTEGER},
    refreshToken: {type: DataTypes.STRING, require: true}
})

User.hasMany(Post)
Post.belongsTo(User)

User.hasMany(Tokens)
Tokens.belongsTo(User)

module.exports = {
    User, Post, Tokens
}