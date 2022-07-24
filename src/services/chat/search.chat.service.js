const Chat = require('../../models/chat.model')
const mongoose = require('mongoose')

class SearchChatService {
    async getDeletedChatByUsers(users) {
        const [user1, user2] = users

        let chat = await Chat.findOneDeleted({
            $or:[
                {$and: [{first_user: user1}, {second_user: user2}]},
                {$and: [{first_user: user2}, {second_user: user1}]}
            ]
        })

        if (!chat || chat.type != 1) {
            return null
        }

        return chat
    }

    async findNotDeletedChat(users) {
        const [user1, user2] = users

        return  Chat.findOne({
            $or:[
                {$and: [{first_user: user1}, {second_user: user2}]},
                {$and: [{first_user: user2}, {second_user: user1}]}
            ],
            type: 1
        })
    }
}

module.exports = new SearchChatService()