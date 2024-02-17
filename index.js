const express = require('express');
const app = express();
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');

app.use(cors());

const PORT = 8080;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    }
});

io.on('connection', (socket) => {
    console.log(`Connected User ID: ${socket.id}`);

    socket.on('join_channelToken', (data) => {
        console.log(`User Joined Token: ${data}`);
        socket.join(data);
        
    });

    socket.on('leave_channel',(data)=>{
        console.log("LEAVE FROM CHANNEL")
        socket.leave(data);
    })

    socket.on('send_message', (data) => {
        // console.log(`User Sent Message: ${data.message} to Token: ${data.channelToken}`);
        socket.to(data.channelToken).emit('receive_message', data);
    });

    socket.on('face_verification_success',(data)=>{
        console.log("face_verification_success")
        socket.to(data.channelToken).emit('face_verification',data);
    });

    socket.on('face_verification_failed',(data)=>{
        console.log("face_verification_failed")
        socket.to(data.channelToken).emit('face_verification',data);
    });

    socket.on('capture_selfie_success',(data)=>{
        socket.to(data.channelToken).emit('capture_selfie',data);
    });

    socket.on('capture_selfie_failed',(data)=>{
        socket.to(data.channelToken).emit('capture_selfie',data);
    });

    socket.on('capture_pictures_of_ID_success',(data)=>{
        socket.to(data.channelToken).emit('capture_pictures_of_ID',data);
    });

    socket.on('capture_pictures_of_ID_failed',(data)=>{
        socket.to(data.channelToken).emit('capture_pictures_of_ID',data);
    });

    socket.on('user_enqueue_or_dequeue',(data)=>{
        socket.broadcast.emit('receive_user_enqueue_or_dequeue',data);
    })

    socket.on('test_message',(data)=>{
        socket.broadcast.emit('receive_test_message',data);
    })

    socket.on('switch_camera',(data)=>{
        console.log("SWITCH CAMERA")
        socket.to(data.channelToken).emit('receive_switch_camera',data);
    })

    socket.on('send_user_details',(data)=>{
        console.log("send_user_details",data)
        socket.to(data.channelToken).emit('receive_user_details',data);
    })




});

server.listen(PORT, () => {
    console.log('SERVER RUNNING ON PORT 8080');
});