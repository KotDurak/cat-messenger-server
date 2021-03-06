const mongoose = require('mongoose')

const User = mongoose.model(
    'User',
    new mongoose.Schema({
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            min: 6,
            max: 12,
            required: true,
        },
        nick: {
            type: String,
            min:2,
            max:100,
            required: true,
            unique: true
        },
        birth_day: {
            type: Date,
        },
        gender: {
            type: Number,
            default: 0,
        },
        status: {
            type: Number,
            default: 0,
        },
        socket_id: {
            type: String,
            index: true
        },
        roles: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Role'
        }],
        black_list: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Chat'
        }]
    })
)

module.exports = User