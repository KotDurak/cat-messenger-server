const Chat = require('../../models/chat.model')
const mongoose = require('mongoose')

class RefreshUnreadService {
    refresh(chatId, userId) {
         Chat.findById(mongoose.Types.ObjectId(chatId), (error, chat) => {
             if (!chat) {
                 return;
             }

            if (!chat.unread) {
                return
            }

            chat.unread.set(userId, 0)

            chat.save()
        })

    }
}


module.exports = new RefreshUnreadService()