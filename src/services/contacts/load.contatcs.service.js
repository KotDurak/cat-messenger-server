const Chat = require('../../models/chat.model')

class LoadContatcsService {
     async getUserContacts(userId) {
        const chats = await Chat.find({
            $or:[{first_user: userId}, {second_user: userId}]
        }).populate('users', '_id, nick').exec();

        const result = [];

        for (let i = 0; i < chats.length; i++) {
            const chat = chats[i]
            const chatName = this.isUserChat(chat.type) ? this.getUserNameByChat(chat.users, userId) : chat.name
            let unread = 0;
            if (chat.unread) {
                unread = chat.unread.get(userId) || 0
            }

            const contactObj = {
                id: chat._id,
                name: chatName,
                type: chat.type,
                unread: unread
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
}


module.exports = new LoadContatcsService();