const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const {Server} = require('socket.io')
const io = new Server(server)
const cors = require('cors')
const bodyParser = require('body-parser')
const db = require('./src/models')
const authRouter = require('./src/routes/auth')
const initRoleService = require('./src/services/InitRoleService')

require('dotenv').config();

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



app.use('/auth', authRouter);

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
       io.emit('chat message', msg)
    })

})

server.listen(port, () => {
    console.log(`Server work on http://localhost:${port}`);
})