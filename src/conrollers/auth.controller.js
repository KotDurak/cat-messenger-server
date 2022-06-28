const config = require('../../config/auth')
const db = require('../models')
const User = db.user
const Role = db.role
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

