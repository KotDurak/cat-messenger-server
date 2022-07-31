const messagesService = require('../services/chat/messages.service')
const User = require('../models/user.model')
const checkBackList = require('../services/contacts/check.black.list')

module.exports = (io) => {
    io.on('connection', (socket) => {
        const logout = async () => {
            const user = await User.findOne({socket_id: socket.id})
            if (user) {
                user.socket_id = null
                user.status = 0
                user.save()
                socket.broadcast.emit('userDisconnect', {
                    user_id: user._id
                });
            }
        }

        socket.on('send_message', async (data) => {
            const findByUser = data.find_by_user || false;
            const userFrom = await User.findById(data.from)

            let result = null
            let check = findByUser
                ? await checkBackList.checkForUser(data.from, data.to)
                : await  checkBackList.checkByChat(data.from, data.to);

            if (!check.can_message) {
                io.to(userFrom.socket_id).emit('notice', {
                    message: check.message,
                    type: check.type
                });
                return
            }

            if (findByUser) {

                 result = await  messagesService.sendByUser(data.from, data.to, data.message);
            } else {
                result = await messagesService.sendMessageToChatRoom(data.from,
                    data.to,
                    data.message,
                    data.restore_by_send
                )
            }

            if (!result) {
                return
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
            socket.broadcast.emit('userLogin', {
                user_id: user._id
            })
        })

        socket.on('user_logout', logout)

        socket.on('disconnect', logout)
    })
}