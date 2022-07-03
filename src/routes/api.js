const express = require('express')
const router = express()
const contactsController = require('../conrollers/contacts.controllser')

router.get('/contacts/search/:id/:query', contactsController.searchContacts)

router.post('/create-chat', (req, res) => {
    console.log(req.body)
    res.send({message: 'ok'})
})

module.exports = router