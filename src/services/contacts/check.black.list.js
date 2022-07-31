const User = require('../../models/user.model')
const Chat = require('../../models/chat.model')
const mongoose = require('mongoose')

class CheckBlackList {
    async checkByChat(sender, toChat) {
        const chat = await Chat.findOneWithDeleted({_id:mongoose.Types.ObjectId(toChat)})

        if (!chat) {
            return Promise.resolve(true)
        }

        let toUser = null

        for (let i = 0; i < chat.users.length; i++) {
            let userId = chat.users[i].toString()
            if (userId !== sender) {
               toUser = chat.users[i];
               break;
            }
        }

        if (!toUser) {
            return Promise.resolve({
                can_message: true,
                message: null
            })
        }

        return  this.checkForUser(sender, toUser)
    }

    async checkForUser(sender, toUser) {
        const user = await User.findById(toUser)
        const senderUser = await User.findById(sender)

        if (!user.black_list) {
            return  {
                can_message: true,
                message: false
            }
        }


        const addresseeInBlackList = senderUser.black_list && senderUser.black_list.indexOf(toUser) !== -1;
        const senderInBlackList = user.black_list && user.black_list.indexOf(sender) !== -1;
        if (!addresseeInBlackList && !senderInBlackList) {
            return  {
                can_message: true,
                message: false
            }
        }

        return {
            can_message: false,
            message: `Вы не можете отправлять сообщение пользователю ${user.nick}`,
            type: 'danger'
        }
    }
}

module.exports = new CheckBlackList()