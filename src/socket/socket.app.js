const messagesService = require('../services/chat/messages.service')
const User = require('../models/user.model')

module.exports = (io) => {
    io.on('connection', (socket) => {
        socket.on('chat message', (msg) => {
            io.emit('chat message', msg)
        })


        socket.on('send_message', async (data) => {
            const findByUser = data.find_by_user || false;
            let result = null
            if (findByUser) {
                 result = await  messagesService.sendByUser(data.from, data.to, data.message);
            } else {
                 result = await messagesService.sendMessageToChatRoom(data.from, data.to, data.message)
            }

            User.find({_id: {
                    $in: result.chat.users
                }}).exec((err, users) => {
                    if (err) {
                        throw err
                    }

                users.forEach(user => {
                    io.to(user.socket_id).emit('newMessage', result);
                })
            })
        })

        socket.on('user_login', async (data) => {
            const user = await User.findById(data.user_id);
            user.socket_id = socket.id;
            user.save();
        })

        socket.on('disconnect', async () => {
            const user = await User.findOne({socket_id: socket.id})
            if (user) {
                user.socket_id = null
                user.status = 0
                user.save()
            }
        })
    })
}