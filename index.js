require('dotenv').config();
const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const io = require('socket.io')(server, {
    cors: {
        origin: process.env.CORS_ORIGIN
    }
})
const cors = require('cors')
const bodyParser = require('body-parser')
const socketApp = require('./src/socket/socket.app')

const db = require('./src/models')
const authRouter = require('./src/routes/auth')
const initRoleService = require('./src/services/InitRoleService')
const apiRouter = require('./src/routes/api')


const port = process.env.PORT || 3001;


db.mongoose
    .connect(`mongodb://${db.config.HOST}:${db.config.PORT}/${db.config.DB}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log("Successfully connect to MongoDB.")
        initRoleService.initial()
    }).catch(err => {
        console.log('Mongo connect error', err)
        process.exit()
})

app.use(express.static('public'))
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

socketApp(io);

exports.sockets = io

app.use('/auth', authRouter);
app.use('/api', apiRouter)


server.listen(port, () => {
    console.log(`Server work on http://localhost:${port}`);
})