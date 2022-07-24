const User = require('../../models/user.model')
const mongoose = require('mongoose')

class BlackListService {
    async addUserBlackList(senderId, userId) {
        const sender = await User.findById(senderId)

        if (!sender) {
            return
        }

        if (!sender.black_list) {
            sender.black_list = []
        }

        if (sender.black_list.indexOf(userId) === -1) {
            sender.black_list.push(userId)
            sender.save()
        }
    }
}



module.exports = new BlackListService()