const mongoose = require('mongoose')
const User = require('../models/user.model')

exports.searchContacts = (req, res) => {
    const userId = req.params.id
    const searchQuery = req.params.query

    if (!searchQuery) {
        res.send({
            users: [],
            message: 'ok'
        })
    }

    User.find({$and:[
            {
                $or:[
                    {nick: {$regex: searchQuery}},
                    {email:{$regex: searchQuery}}
                ]
            },
            {
                _id: {$ne: mongoose.Types.ObjectId(userId)}
            }
        ]}, (err, result) => {
        if (err) {
            res.status(500).send({message: 'Internal error'})
            return
        }

          const users = result.map(user => {
              return {
                  id: user._id,
                  nick: user.nick,
                  gender: user.gender,
                  status: user.status,
                  type: 'user',
              }
          })

          res.send({
              users: users,
              message: 'Ok'
          })
    })
}