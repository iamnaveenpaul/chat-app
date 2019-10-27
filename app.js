const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const UserClass = require('./controllers/user.js');
const userObj = new UserClass();

const MessageClass = require('./controllers/message');
const messageObj = new MessageClass();

//Middleware Start

app.use(bodyParser.json());

//Middleware End

mongoose.connect("mongodb://localhost/chat-app?poolSize=100",{ useNewUrlParser: true },function(error){
    if(error){
        console.log("MongoDb connection failed");
        console.log(error);
    } else {
        console.log("MongoDb connection successful");
    }
});

app.use(function(req,res,next){
    console.log("Am I a midddleware?");
    next();
})

app.get('/', function(req, res) {
    res.render('index.ejs');
});

app.get('/register', function(req, res) {
    res.render('registration.ejs');
});

io.sockets.on('connection', function(socket) {
    socket.on('username', function(username) {
        socket.username = username;
        io.emit('is_online', ' <i>' + socket.username + ' joined the chat..</i>');
    });

    socket.on('disconnect', function(username) {
        io.emit('is_online', ' <i>' + socket.username + ' left the chat..</i>');
    })

    socket.on('chat_message', function(message) {
        messageObj.storeMessage({userName:socket.username,text:message},function(err,results){
            console.log(err)
            console.log(results);
        });

        io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
    });

});

app.post('/register/user', function(req, res) {
    console.log(req.body)
    userObj.storeUser(req.body,function(err,result){
        res.send(result);
    })
});

app.get('/get/all/registered/users', function(req, res) {
    userObj.findAllUsers(function(err,users){
        res.send({
            err:err,
            users:users
        })
    })
});

app.get('/get/all/messages', function(req, res) {
    messageObj.findAll(function(err,messages){
        res.send({
            err:err,
            messages:messages
        })
    })
});

app.get('/find/users/by/name', function(req, res) {
    userObj.findUsersByName(req.query.name,function(err,users){
        res.send({
            err:err,
            users:users
        })
    })
});

app.get('/update/users/fullname', function(req, res) {
    userObj.updateFullNameByUserName(req.query.userName,req.query.fullName,function(err,result){
        res.send({
            err:err,
            result:result
        })
    })
});

const server = http.listen(7000, function() {
    console.log('listening on *:7000');
});