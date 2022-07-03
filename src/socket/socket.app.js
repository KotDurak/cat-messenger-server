const messagesService = require('../services/chat/messages.service')
const User = require('../models/user.model')

module.exports = (io) => {
    io.on('connection', (socket) => {
        socket.on('chat message', (msg) => {
            io.emit('chat message', msg)
        })


        socket.on('send_message', async (data) => {
           const result = await messagesService.sendMessage(
                data.from,
                data.to,
                data.message,
                data.type,
            )

            User.find({_id: {
                    $in: [data.from, data.to]
                }}).exec((err, users) => {
                    if (err) {
                        throw err
                    }

                users.forEach(user => {
                         io.to(user.socket_id).emit('newMessage', result);

                       /* const currentSocket = io.sockets.socket[user.socket_id]
                        if (currentSocket) {
                            currentSocket.emit('new_message', result)
                        }*/
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