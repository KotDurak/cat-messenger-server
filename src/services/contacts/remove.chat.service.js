const Chat = require('../../models/chat.model')
const mongoose = require('mongoose')

class RemoveChatService {
    async removeChat(senderId, chatId) {
        const id = mongoose.Types.ObjectId(chatId)
        const chat = await Chat.findById(id)

        if (!chat) {
            return true
        }

        return await chat.delete()
    }
}

module.exports = new RemoveChatService()