const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const messageFormat=require('./utils/messageFormat')
const {getCurrentUser,userJoin,userLeave,getRoomUsers}=require('./utils/users')

const app=express()
const server=http.createServer(app)
const io=socketio(server)

app.use(express.static(path.join(__dirname,'public')))

io.on('connection',socket=>{
    console.log("New WS Connection...");
    

    socket.on('joinRoom',({username,room})=> {
        
        const user=userJoin(socket.id,username,room)

        socket.join(user.room) 
    
    
    socket.emit('message',messageFormat('Bot','Welcome to the chatRoom'))
    
    socket.broadcast.to(user.room).emit('message',messageFormat('Bot',`${user.username} has joined the chat`))

    io.to(user.room).emit('roomUsers',{
        room:user.room,
        users:getRoomUsers(user.room)
    })
    })

    

    socket.on('chatMessage',(msg)=>{
        const user=getCurrentUser(socket.id)
        console.log(user.room);
        io.to(user.room).emit('message',messageFormat(user.username,msg))
    })

    socket.on('disconnect',()=>{
        const user=userLeave(socket.id)

        if (user) {
            io.to(user.room).emit('message',messageFormat('Bot',`${user.username} has left the chat`))
        
            io.to(user.room).emit('roomUsers',{
                room:user.room,
                users:getRoomUsers(user.room)
            })
        
        }
    })

})




server.listen(3000,()=>{
    console.log("Server is listening");
})