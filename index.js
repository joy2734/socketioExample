const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io');
const io = new Server(server);

app.get('/', (req, res)=>{
    res.sendFile(__dirname + '/index.html');
})

var sockets = []
io.on('connection', (socket)=>{
    const id = socket.id;
    //socket.broadcast.emit('접속완료');
    //io.emit('user connect', socket);
    // socket.on('connect', () => {
    //     io.emit('user connect',socket);
    // });
    sockets[id] = id;
    io.emit('user connect', {status: 'login', useNickname: false, userName: id});
    
    socket.on('set nickname', (nickname)=>{
        console.log(nickname)
        sockets[id] = nickname;
        io.emit('user connect', {status: 'login', userName: nickname, useNickname: true});
    });

    socket.on('chat message', (msg)=>{
        io.emit('chat message', msg);
    });    
    
    socket.on('disconnect', () => {
        io.emit('user disconnect', {status: 'logout', userName: sockets[id]});
    });

});

server.listen(3000, ()=>{
    console.log('listening on *:3000');
})