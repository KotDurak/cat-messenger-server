module.exports = (io) => {
    io.on('connection', (socket) => {
        socket.on('chat message', (msg) => {
            io.emit('chat message', msg)
        })


        socket.on('user_login', data => {

        })

        socket.on('disconnect', () => {
            console.log(socket)
        })
    })
}