const Chat = require('../../models/chat.model')
const MessageModel =  require('../../models/message.model')

const TYPE_USER = 1;
const TYPE_GROUP = 2;

class MessagesService {
    async sendMessage(from, to, message, type = TYPE_USER) {
        if (type === 'user') {
            return await this.sendByUser(from, to, message)
        } else {
            //TODO Раздел для групповых бесед
            return null;
        }
    }

    async sendByUser(from, to, message) {
        const chat = await this.getChatByUsers(from, to);
        const newMessage = await this.addMessageToChat(from, to, message, chat);

        return  {
            chat,
            message: newMessage
        }

    }

    async getChatByUsers(from, to) {
        let chat = await Chat.findOne({
            $and: [
                {type: TYPE_USER},
                {
                    $or: [
                        {$and: [{first_user: to, second_user: from}]},
                        {$and: [{first_user: from, second_user: to}]}
                    ]
                }
            ]
        }).populate('users').exec()

        if (!chat) {
            chat = new Chat({
                type: TYPE_USER,
                first_user: from,
                second_user: to,
                users: [from, to],
            })

            chat.save();
        }

        return chat;
    }

    async addMessageToChat(from, to, message, chat) {
        const newMessage = new MessageModel({
            from: from,
            to: to,
            chat: chat._id,
            message: message
        })

        return newMessage.save()
    }

}

module.exports = new MessagesService()