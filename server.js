const path=require('path');
const http=require('http');
const express=require('express');
const socketio=require('socket.io');
const formatmsg=require('./utils/messages');
const {userjoin,
    getcurrentuser,
    userleave,
    getroomusers}=require('./utils/users');

const app=express();
const server=http.createServer(app);
const io=socketio(server);
const botname='Chat Bot';
io.on('connection',socket=>{
    socket.on('joinroom',({username,room})=>{
        const user=userjoin(socket.id,username,room);
        socket.join(user.room);

        socket.emit('message',formatmsg(botname,'Welcome to Chatkaronaa'));
        socket.broadcast.to(user.room).emit('message',formatmsg(botname,`${user.username} has joined`));

        io.to(user.room).emit('roomusers',{
            room:user.room,
            users:getroomusers(user.room)
        });
    });

        socket.on('chatMessage',(msg)=>{
            const user=getcurrentuser(socket.id);
            io.to(user.room).emit('message',formatmsg(user.username,msg));

            
        });

        socket.on('disconnect',()=>{
            const user=userleave(socket.id);
            if(user){
                io.to(user.room).emit('message',formatmsg(botname,`${user.username} has left`));
                io.to(user.room).emit('roomusers',{
                    room:user.room,
                    users:getroomusers(user.room)
                });
            }
            
        });
});
app.use(express.static(path.join(__dirname,'public')));

const PORT=3000||process.env.PORT;

server.listen(PORT,()=>console.log(`Server running on port number ${PORT}`)); 