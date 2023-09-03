//required packages
const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
//required modules
const formatMessage = require('./public/helper/formatDate');
const {
  getActiveUser,
  exitRoom,
  newUser,
  getIndividualRoomUsers
} = require('./public/helper/userHelper');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const PORT = 3000;

//set public folder
app.use(express.static(path.join(__dirname, 'public')));

//block runs when the client connects
io.on('connection', socket => {
    try{
        socket.on('joinRoom', ({ username, room }) => {
        const user = newUser(socket.id, username, room);
    
        socket.join(user.room);
        socket.emit('message', formatMessage("Airtribe", 'Messages are limited to this room! '));
    
        //broadcast everytime users connects
        socket.broadcast
            .to(user.room)
            .emit(
            'message',
            formatMessage("Airtribe", `${user.username} has joined the room`)
            );
    
        //current active users and room name
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getIndividualRoomUsers(user.room)
        });
        });
    
        //listen for client message
        socket.on('chatMessage', msg => {
        const user = getActiveUser(socket.id);
    
        io.to(user.room).emit('message', formatMessage(user.username, msg));
        });
    
        //runs when client disconnects
        socket.on('disconnect', () => {
        const user = exitRoom(socket.id);
    
        if (user) {
            io.to(user.room).emit(
            'message',
            formatMessage("Airtribe", `${user.username} has left the room`)
            );
    
            //current active users and room name
            io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getIndividualRoomUsers(user.room)
            });
        }
        });
    }catch{
        console.log("Error occured in connecting", error);
    }
  });

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));