const Chat = require('../../models/chat.model')
const mongoose = require('mongoose')

class SearchChatService {
    async getDeletedChatByUsers(users) {
        let chat = await Chat.findOneDeleted({
            users: {$all: users}
        })

        if (!chat || chat.type != 1) {
            return null
        }

        return chat
    }
}

module.exports = new SearchChatService()