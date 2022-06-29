const express = require('express')
const authRouter = express();
const {verifySignup} = require('../middlewares')
const controller = require('../conrollers/auth.controller')

authRouter.use((req, res, next) => {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next()
})

authRouter.get('/', (req, res) => {
    res.send({message: 'Auth router'});
})

authRouter.post('/login', controller.signin)

authRouter.post('/logout', (req, res) => {
    res.send({message: 'logout'})
});

authRouter.post('/signup',
    [verifySignup.checkDuplicateNickOrNick, verifySignup.checkRolesExisted],
    controller.signup
)

module.exports = authRouter;