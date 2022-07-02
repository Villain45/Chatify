const express = require('express');
const dotenv = require('dotenv');
const connectDB =require('./config/db')
const  chats  =require('./data/data')
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')
const messageRoutes = require('./routes/messageRoutes')
const { notFound , errorHandler } = require('./middleware/errorMiddleware')


const app = express();
const PORT = process.env.PORT || 5000

dotenv.config();
connectDB(); 

app.use(express.json());  //to acccept json data

app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes);
app.use('/api/message',messageRoutes);


// app.use(notFound);
// app.use(errorHandler)

app.get('/',(req,res) => {
    res.send('Running');
})




const server=app.listen(PORT,console.log('Running at 5000'))

const io=require("socket.io")(server,{
    pingTimeout:60000,  //waits for 60 seconds until no changes are made after that it closes the connection
    cors:{
        origin:"http://localhost:5000/"
    }
})

io.on('connection', (socket) => { //socket var is passed from frontend

    socket.on("setup",(userData) => { //userData is passed from frontend
        socket.join(userData._id);
        // console.log(userData._id);  //gives the id of the setuped user
        socket.emit("connection")
    })

    socket.on("join chat",(room) => { //room is passed from frontend
        socket.join(room);
        console.log("User joined room "+room);
    })

    socket.on("typing",(room)=>{
        socket.to(room).emit("typing");
    })

    socket.on("stop typing",(room)=>{
        socket.to(room).emit("stop typing");
    })

    socket.on("new message",(newMessageReceived) => {
        var chat = newMessageReceived.chat;

        if(!chat.users) return console.log("chat.users is not defined");

        chat.users.forEach((user)=>{
            if(user._id == newMessageReceived.sender._id) return; //if it self message then do nothing

            socket.to(user._id).emit("message recieved",newMessageReceived);
        })
    })

    socket.off("setup",()=>{
        console.log("User Disconnected");
        socket.leave(userData._id)
    })
})