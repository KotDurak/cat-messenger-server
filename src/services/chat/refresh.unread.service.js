const Chat = require('../../models/chat.model')
const Message = require('../../models/message.model')
const User = require('../../models/user.model')

const mongoose = require('mongoose')

class RefreshUnreadService {
    refresh(chatId, userId, io) {
        Chat.findById(mongoose.Types.ObjectId(chatId), async (error, chat) => {
            if (!chat) {
                return;
            }

            if (!chat.unread) {
                return
            }

            const messages = await Message.find({
                $and: [
                    {chat: chatId},
                    {read: false},
                    {
                        from: {
                            $ne: userId
                        }
                    }
                ]
            })

            if (messages.length > 0) {
                const fromUser = messages[0].from
                this.sendUserAboutRead(io, fromUser, chatId)
            }

            chat.unread.set(userId, 0)

            messages.forEach(m => {
                m.read = true
                m.save()
            })

            chat.save()
        })
    }

    async sendUserAboutRead(io, userId, chatId) {
        const user = await User.findById(userId)
        io.to(user.socket_id).emit('refreshUnread', {
            chatId,
            userId
        })
    }
}


module.exports = new RefreshUnreadService()