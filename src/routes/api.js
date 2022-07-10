const express = require('express')
const router = express()
const contactsController = require('../conrollers/contacts.controllser')
const messagesController = require('../conrollers/messages.controller')

router.get('/contacts/search/:id/:query', contactsController.searchContacts)

router.get('/load-contacts/:id', contactsController.loadContacts)

router.get('/messages/:id', messagesController.getMessages)

module.exports = router