const mongoose = require('mongoose')
const dbConfig = require('../../config/db.config')
mongoose.Promise = global.Promise
const db = {}
db.mongoose = mongoose
db.user = require('./user.model')
db.role = require('./role.model')
db.ROLES = ['user', 'admin', 'moderator']
db.config = dbConfig

module.exports = db
