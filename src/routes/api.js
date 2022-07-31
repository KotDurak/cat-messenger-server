const express = require('express')
const router = express()
const contactsController = require('../conrollers/contacts.controllser')
const messagesController = require('../conrollers/messages.controller')
const {authJwt} = require('../middlewares')

router.get('/contacts/search/:id/:query', contactsController.searchContacts)

router.get('/load-contacts/:id', contactsController.loadContacts)

router.get('/contacts/:id', contactsController.getUserInfo)
router.delete('/contacts/:id', authJwt.verifyToken, contactsController.deleteContact)

router.get('/contacts/search-delete/:id', authJwt.verifyToken, contactsController.searchDeleted)

router.get('/messages/:id', messagesController.getMessages)

router.post('/refresh-unread', messagesController.refreshUnread)

router.put('/contacts/add-black-list/:id', authJwt.verifyToken, contactsController.addBlackList)

router.delete('/contacts/remove-black-list/:id', authJwt.verifyToken, contactsController.removeBlackList)

module.exports = router