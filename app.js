const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
var bodyParser = require('body-parser');

const ConversationClass = require('./controllers/conversation.js');
const conversationObj = new ConversationClass();

const UserClass = require('./controllers/user.js');
const userObj = new UserClass();

const UserConversation = require('./controllers/userConversation');
const userConvObj = new UserConversation();

mongoose.connect("mongodb://localhost/chat-app?poolSize=100",{ useNewUrlParser: true },function(error){
    if(error){
        console.log("MongoDb connection failed");
        console.log(error);
    } else {
        console.log("MongoDb connection successful");
    }
});

app.use(bodyParser.json());
app.use(userObj.checkUserNameExists);

app.get('/', function(req, res) {
    res.render('index.ejs');
});

app.get('/edit/username', function(req, res) {
    res.render('userSettings.ejs');
});

app.post('/save/username', function(req, res) {
    console.log(req.body);

    userObj.storeUser(req.body,function(err,result){
        res.send({
            err:err,
            result:result
        })
    });
});

app.get('/get/messages/analytics/v4', function(req, res) {
    userConvObj.getAnalytics(function(err,results){
        res.send({
            err:err,
            results:results
        })
    })
});

app.get('/get/messages/analytics/v5', function(req, res) {
    userConvObj.getHashmaps(function(err,results){
        res.send({
            err:err,
            results:results
        })
    })
});

app.get('/get/messages/analytics/v6', function(req, res) {
    userConvObj.getAnalyticsUsingOnlyLoops(function(err,results){
        res.send({
            err:err,
            results:results
        })
    })
});

app.get('/get/messages/analytics', function(req, res) {
    
    conversationObj.getAllConversations(function(err,data){

        var result = {}
        var dateMin = req.query.dateMin;
        var dateMax = req.query.dateMax;

        if(!err && data && data.length>0){
            data.forEach(function(el,index){
                if(result[el.userName]){
                    if(new Date(el.date)>=new Date(dateMin) && new Date(el.date)<=new Date(dateMax)){
                        result[el.userName].count++;
                        result[el.userName].messages.push(el)
                    }
            } else {

                    if(new Date(el.date)>=new Date(dateMin) && new Date(el.date)<=new Date(dateMax)){
                        result[el.userName] = {
                            count:1,
                            messages:[el]
                        };
                    }
                };
            })
        }

        res.send(result);
    })
});

app.get('/get/messages/analytics/v2', function(req, res) {
    
    conversationObj.getConversationsAnalytics(req.query.range,function(err,data){

        var monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

        // data.forEach(function(el){
        //     el.month = monthNames[el._id.month-1]
        //     el.monthYear = monthNames[el._id.month-1] +" "+ el._id.year
        // })

        res.send({
            err:err,
            data:data
        });
    })
});

app.get('/get/messages/analytics/v3', function(req, res) {

    var dateMin = req.query.dateMin;

    conversationObj.searchConversationsByDate(dateMin,function(err,data){
        var result = {}

        if(!err && data && data.length>0){
            data.forEach(function(el,index){
                if(result[el.userName]){
                    result[el.userName].count++;
                    result[el.userName].messages.push(el)
            } else {

                    result[el.userName] = {
                        count:1,
                        messages:[el]
                    };
                };
            })
        }

        res.send(result);
    })
});

app.get('/get/all/messages', function(req, res) {
    
    conversationObj.getAllConversations(function(err,data){
        res.send(data);
    })
});

app.get('/get/messages/for/user', function(req, res) {
    
    conversationObj.getConversationsForUser(req.query.userName,function(err,data){
        res.send(data);
    })
});

app.get('/get/messages/for/user/v2', function(req, res) {
    
    conversationObj.getAllConversations(function(err,data){

        var filteredData = data.filter(function(el){
            return el.userName == req.query.userName
        })
        .map(function(el){
            return {
                text:el.text,
                date: el.date
            };
        })
        .sort(function(el1,el2){
            return new Date(el1.date)<new Date(el2.date);
        })

        res.send({
            filteredData:filteredData
        });
    })
});

app.get('/get/messages/for/user/:id', function(req, res) {
    conversationObj.getConversationsForUser(req.query.userName,function(err,data){
        res.send(data);
    })
});

app.get('/search/for/messages/for/user/:id', function(req, res) {

    var searchStr = req.query.searchStr;
    var userName = req.params.id;

    conversationObj.searchConversationsForUser(userName,searchStr,function(err,data){
        res.send(data);
    })
});

app.get('/search/for/messages/for/user/date/:id', function(req, res) {

    var searchStr = req.query.searchStr;
    var dateMin = req.query.dateMin;
    var userName = req.params.id;

    conversationObj.searchConversationsForUserWithDate(userName,searchStr,dateMin,function(err,data){
        res.send(data);
    })
});

app.get('/search/for/messages/for/user/between/dates/:id', function(req, res) {

    var searchStr = req.query.searchStr;
    var dateMax = req.query.dateMax;
    var dateMin = req.query.dateMin;
    var userName = req.params.id;

    conversationObj.searchConversationsForUserBetweenDates(userName,searchStr,dateMin,dateMax,function(err,data){
        res.send(data);
    })
});

app.post('/update/username', function(req, res) {

    var existingUserName = req.body.existingUserName;
    var newUserName = req.body.newUserName;

    console.log(req.query);
    console.log(req.body);

    conversationObj.updateUserName(existingUserName,newUserName,function(err,data){
        res.send(data);
    })
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
        conversationObj.storeConversation({
            userName:socket.username,
            text:message
        },function(err,result){

        });
        io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
    });

});

const server = http.listen(7000, function() {
    console.log('listening on *:7000');
});