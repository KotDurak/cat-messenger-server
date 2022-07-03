const mongoose = require('mongoose')

const Message = mongoose.model(
    'Message',
    new mongoose.Schema({
        message: {
            type: String,
            max: 300
        },
        chat: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Chat',
          index: true,
        },
        from: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        to: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        time: {
            type: Date,
            default: Date.now
        },
        read: {
            type: Boolean,
            default: false
        }
    })
)

module.exports = Message