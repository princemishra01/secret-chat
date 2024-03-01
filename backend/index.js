const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors : {
        origin: '*',
    }
});

// Add your Socket.IO logic here

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('join-room', (room) => {
        socket.join(room);
        console.log('A user joined room', room)
    });

    socket.on('message', ({newMessage, room}) => {
        io.to(room).emit('message', newMessage);
        console.log('Message sent to room', room , ":", newMessage);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });

    socket.on('leave-room', (room) => {
        socket.leave(room);
        console.log('A user left room', room);
    });
});

const port = 5000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});