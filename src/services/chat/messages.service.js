const Chat = require('../../models/chat.model')
const MessageModel =  require('../../models/message.model')
const mongoose = require('mongoose')
const User = require('../../models/user.model')

const TYPE_USER = 1;
const TYPE_GROUP = 2;

class MessagesService {
    async sendByUser(from, to, message) {
        const chat = await this.getChatByUsers(from, to);
        const newMessage = await this.addMessageToChat(from, to, message, chat);
        const sender = await this.getSenderInfo(from)

        return  {
            chat,
            message: newMessage,
            sender,
        }
    }

    async sendMessageToChatRoom(from, chatId, message) {
        const chat = await Chat.findOne(mongoose.Types.ObjectId(chatId))
        const to = null
        const newMessage = await this.addMessageToChat(from, null, message, chat)
        const sender = await this.getSenderInfo(from)

        return {
            chat,
            message: newMessage,
            sender
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
        }).populate('users', '_id, nick').exec()

        if (!chat) {
            chat = new Chat({
                type: TYPE_USER,
                first_user: from,
                second_user: to,
                users: [from, to],
            })

            chat.save();
            chat.populate('users', '_id, nick')
        }

        return chat;
    }

    async addMessageToChat(from, to, message, chat) {
        const newMessage = new MessageModel({
            from: from,
            to: to,
            chat: chat._id,
            message: message,
        })

        return newMessage.save()
    }


    async loadMessages(chatId, page = 1, size = 10) {
        const count =  await MessageModel.countDocuments({chat_id: chatId})

        const messages = await MessageModel.find({
            chat: chatId
        }).limit(size)
            .skip((page - 1) * size)
            .sort({_id: -1}).exec()

        return  {
            meta: {
                count
            },
            data: messages
        }
    }

    async getSenderInfo(userId) {
        const user =  await User.findById(mongoose.Types.ObjectId(userId));

        return {
            id: user._id.toString(),
            nick: user.nick,
            gender: user.gender
        }
    }
}

module.exports = new MessagesService()