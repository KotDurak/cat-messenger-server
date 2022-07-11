const config = require('../../config/auth')
const db = require('../models')
const User = db.user
const Role = db.role
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

exports.signup = async (req, res) => {
    const password = await bcrypt.hash(req.body.password, 8)
    console.log(password)
    const user = new User({
        email: req.body.email,
        nick: req.body.nick,
        password: password,
        birthday: req.body.birth_day,
        gender: req.body.gender
    });

    user.save((err, user) => {
        if (err) {
            res.status(500).send({message: 'Internal error'})
            return
        }

        Role.findOne({name: 'user'}, (err, role) => {
            if (err) {
                res.status(500).send({message: 'Internal error'})
                return
            }

            user.roles = [role._id]
            user.save(err => {
                if (err) {
                    res.status(500).message({error: 'Internal error'})
                    return
                }

                res.send({message: 'User registered success'})

            })
        })
    })
}

exports.signin = (req, res) => {
    User.findOne({$or:[{nick: req.body.username}, {email: req.body.username}]})
        .populate('roles')
        .exec(async (err, user) => {
            if (err) {
                res.status(500).send({ message: 'Internal error' });
                return
            }
            if (!user) {
                return res.status(404).send({ message: "User Not found." })
            }

            if (!req.body.password) {
                res.status(400).send({message: 'Empty password'})
            }

            const passwordIsValid = await bcrypt.compare(req.body.password, user.password)

            if (!passwordIsValid) {
                res.status(401).send({
                    accessToken: null,
                    message: 'Invalid password'
                })
            }

            const token = jwt.sign({id: user.id}, config.secret, {
                expiresIn: 86400 * 31
            })

            user.status = 1
            user.save()

            res.status(200).send({
                id: user._id,
                nick: user.nick,
                email: user.email,
                gender: user.gender,
                status: 1,
                accessToken: token
            })
        })
}

exports.autlogin = async (req, res) => {
    if (!req.body.id) {
        res.status(400).send('Empty id')
    }

    const user = await User.findById(req.body.id).select({
        _id:1,
        nick:1,
        email:1
    })

    user.status = 1;
    user.save(err => {
        if (err) {
            res.status(500).send({message: 'Internal error'})
        }
        res.send({
            message: 'ok',
            user: user
        })

    })


}