const express = require('express')
const app = express()
const ejs = require('ejs')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const expressSession = require('express-session')
const Message =require('./model/chats')
const registerController = require('./controllers/registerController')
const loginController = require('./controllers/loginController')
const saveMessageController = require('./controllers/saveMessageController')
const homeController = require('./controllers/homeController')

//express appserver connection && socket.io connection
const port = 4000
const server = app.listen(port,() => {
    console.log(`Server is running on port ${port}...`);
})
const { Server } = require("socket.io")
const io = new Server(server)
//========================================================


//connection to chatters DATABASE
mongoose.connect('mongodb://localhost/chattersDB', {useNewUrlParser: true})


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(expressSession({
    secret: 'chatters',
    resave: false,
    saveUninitialized: true
}))

global.loggedIn = null
app.use("*", (req, res, next)=>{
    loggedIn = req.session.userId
    loggedUsername = req.session.username
    loggedSession = req.session.cookie

    next()
})

app.get('/', (req, res)=>{
    res.render('index')
})

app.get('/register', (req, res)=>{
    res.render('register')
})

app.post('/register', registerController.registerUser)

app.get('/login', (req,res)=>{
    res.render('login')
})

app.post('/login', loginController.loginUser)

// app.get('/chat', saveMessageController.getChatPage)
app.get('/chat', homeController.chat)

// app.post('/chat', saveMessageController.saveChats)



 io.on('connection', (socket) => {
        console.log('new connection');
        //loading most recent messages from the database
            // socket.on('connection', ()=> {
            Message.find({})
            .sort({ createdAt: -1 })
            .limit(10)
            .then(messages => {
                socket.emit("load all messages", messages.reverse())
             })
            // })
        
         
         
        socket.on("message", (data)=> {
            let messagesAttributes = {
                content: data.content,
                user: data.userId,
                userName: data.userName
            }
            //saving messages in the database
            m = new Message(messagesAttributes);
            m.save()
                .then(() => {
                    io.emit('message', messagesAttributes )
                })
                .catch(error => console.log(`error: ${error.message}`));
        });
        socket.on('disconnect', () =>{
            let loggedUsername
            socket.broadcast.emit("user disconnected")
            console.log('user disconnected');
        })
    });




