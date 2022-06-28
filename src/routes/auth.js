const express = require('express')
const authRouter = express.Router();


authRouter.get('/', (req, res) => {
    res.send({message: 'Auth router'});
})

authRouter.post('/login', (req, res) => {
    res.send({message: 'login'})
})

authRouter.post('/logout', (req, res) => {
    res.send({message: 'logout'})
});

authRouter.post('/signup', (req, res) => {
    res.send({message: 'signup'})
})

module.exports = authRouter;