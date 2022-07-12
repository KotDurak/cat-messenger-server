const mongoose = require('mongoose')

const Chat = mongoose.model(
    'Chat',
    new mongoose.Schema({
        name: {
            type: String,
            default: null,
            index: true,
        },
        users: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        type: {
            type: Number,
            default: 1,
            index: true
        },
        first_user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            index: true
        },
        second_user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            index: true
        },
        unread: {
            type: Map,
            of: Number
        }
    })
)

module.exports = Chat