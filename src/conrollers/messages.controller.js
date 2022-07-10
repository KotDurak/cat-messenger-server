const messagesService = require('../services/chat/messages.service')

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