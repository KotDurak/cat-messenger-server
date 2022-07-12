const messagesService = require('../services/chat/messages.service')
const refreshUnreadService = require('../services/chat/refresh.unread.service')

exports.getMessages  = async (req, res) => {
    const chatId = req.params.id
    const page = req.query.page|| 1
    const size = req.query.size || 10

    try {
        const result = await messagesService.loadMessages(chatId, page, size)
        res.send(result)
    } catch (e) {
        res.status(500).send({
            message: 'Internal error'
        })
    }
}

exports.refreshUnread = async (req, res) => {
    const {chat_id, user_id} = req.body

    try {
        refreshUnreadService.refresh(chat_id, user_id)
        res.status(200).send({
            message: 'OK',
            code: 0
        })
    } catch (e) {
        res.status(500).send({
            message: 'Internal error'
        })
    }

}