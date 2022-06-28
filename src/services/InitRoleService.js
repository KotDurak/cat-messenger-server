const db = require('../models')
const Role = db.role

class InitRoleService {
    initial() {
        Role.estimatedDocumentCount((err, count) => {
            if (err || count !== 0) {
                return
            }

            db.ROLES.forEach(role => {
                new Role({name: role})
                    .save(err => {
                        if (err) {
                            console.log('Error init role', err)
                        }
                    })
            })
        })
    }
}

module.exports = new InitRoleService()