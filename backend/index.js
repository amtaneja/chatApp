//node server which will handle socket io connection
const path = require('path')
const express = require('express')
const app = express()
const server = require('http').createServer(app)

const io = require('socket.io')(server, {
    cors: {
        origin: '*'
    }
})

const users = {}
const staticPath = path.join(__dirname, "public")
app.use(express.static(staticPath))

//predefined on connection it will listen all socket connection like aman ram krishna 
//different user are listen through io.on

io.on('connection', socket => {

    //user defined on , (new user joined event)
    //instance of server
    //it will listen the only when some person is joined , user jab join hoga toh kya karna hai
    //that will put in callback function
    socket.on('new-user-joined', name => {

        console.log('new user : ', name)

        users[socket.id] = name

        //jab koi new user join hoga toh sabko pata chalna chaiye
        //socket.broadcast.emit event bhejta hai sabko except the person who joined
        socket.broadcast.emit('user-joined', name)

    })


    //chat message bhejne ka event
    //jaise send event call hoga baki logo ko message aur name broadcast ho jyaga
    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] })
    })


    socket.on('disconnect', message => {
        socket.broadcast.emit('leave', users[socket.id])
        delete users[socket.id]
    })


})


app.get('/', (req, res) => {
    res.sendFile(path.join(staticPath, "index.html"))
})

server.listen(5000, () => {
    console.log('server is running at port 5000')
})