const express = require('express')
const router = express()
const contactsController = require('../conrollers/contacts.controllser')

router.get('/contacts/search/:id/:query', contactsController.searchContacts)

module.exports = router