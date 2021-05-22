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
var conUser =[];
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
        //console.log(nickname)
        sockets[id] = nickname;
        conUser.push(nickname);
        io.emit('user connect', {status: 'login', userName: nickname, useNickname: true});
    });

    socket.on('chat message', (msgInfo)=>{
        //msgInfo 채팅유저/메세지내용
        io.emit('chat message', msgInfo);
    });    
    
    socket.on('disconnect', () => {
        conUser = conUser.filter(user => user != sockets[id]);
        io.emit('user disconnect', {status: 'logout', userName: sockets[id]});
    });

    socket.on('req connectlist', ()=>{
        io.emit('get connectlist', conUser);
    });

    socket.on('typing user', (typingInfo)=>{
        io.emit('set typing', typingInfo);
    });

});

server.listen(3000, ()=>{
    console.log('listening on *:3000');
})