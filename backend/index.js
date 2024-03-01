const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors(
    {
        origin: "*",
        methods: '*',
        headers: '*'
    }
));

const server = http.createServer(app);
const io = socketIO(server, {
    cors : {
        origin: "*",
        methods: '*',
        headers: '*'
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

app.get('/', (req, res) => {
    res.send('test route');
});

const port = 5000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
