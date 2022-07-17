const Chat = require('../../models/chat.model')

class LoadContatcsService {
     async getUserContacts(userId) {
        const chats = await Chat.find({
            $or:[{first_user: userId}, {second_user: userId}]
        }).populate('users');

        const result = [];

        for (let i = 0; i < chats.length; i++) {
            const chat = chats[i]
            let chatName = ''
            let online = true
            let user_id = null

            if (this.isUserChat(chat.type)) {
                const chatUser = this.getChatUser(chat.users, userId)
                chatName = chatUser.nick
                online = chatUser.status == 1
                user_id = chatUser._id.toString()
            }

            let unread = 0;
            if (chat.unread) {
                unread = chat.unread.get(userId) || 0
            }

            const contactObj = {
                id: chat._id,
                name: chatName,
                type: chat.type,
                unread: unread,
                online: online,
                user_id: user_id
            };

            result.push(contactObj)
        }

        return result;
    }

    getUserNameByChat(users, userId) {
        const index = users.findIndex(user => user._id.toString() !== userId)

        return index !== -1 ? users[index].nick : '';
    }

    isUserChat(type) {
         return type === 1;
    }

    getChatUser(users, userId) {
         const user = users.find(user => user._id.toString() !== userId)

        return user
    }

    getStatus() {

    }
}


module.exports = new LoadContatcsService();