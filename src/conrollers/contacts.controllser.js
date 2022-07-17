const mongoose = require('mongoose')
const User = require('../models/user.model')
const Chat = require('../models/chat.model')
const loadContatcsService = require('../services/contacts/load.contatcs.service')
const removeChatService = require('../services/contacts/remove.chat.service')
const searchChatService = require('../services/chat/search.chat.service')

exports.searchContacts = (req, res) => {
    const userId = req.params.id
    const searchQuery = req.params.query

    if (!searchQuery) {
        res.send({
            users: [],
            message: 'ok'
        })
    }

    User.find({$and:[
            {
                $or:[
                    {nick: {$regex: searchQuery}},
                    {email:{$regex: searchQuery}}
                ]
            },
            {
                _id: {$ne: mongoose.Types.ObjectId(userId)}
            }
        ]}, (err, result) => {
        if (err) {
            res.status(500).send({message: 'Internal error'})
            return
        }

          const users = result.map(user => {
              return {
                  id: user._id,
                  nick: user.nick,
                  gender: user.gender,
                  status: user.status,
                  type: 'user',
              }
          })

          res.send({
              users: users,
              message: 'Ok'
          })
    })
}

exports.loadContacts = async (req, res) => {
    const userId = req.params.id;
    const chats = await loadContatcsService.getUserContacts(userId);

    res.send({result: chats})
}

exports.deleteContact = async (req, res) => {
    const userId = req.userId
    const chatId = req.params.id
    const deletedChat = await removeChatService.removeChat(userId, chatId)

    res.send({
        chatId: chatId
    })
}

exports.searchDeleted = async (req, res) => {
    const chat = await searchChatService.getDeletedChatByUsers([req.userId, req.params.id])

    if (chat) {
        return res.send({
            id: chat._id.toString()
        })
    }

    res.send({
        id: null
    });
}