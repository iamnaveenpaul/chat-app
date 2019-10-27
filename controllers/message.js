var MessageCollection = require('../models/message').message;

function Message() {};

Message.prototype.storeMessage = function(data,callback){

    var messageObj = new MessageCollection({
        userName: data.userName,
        text: data.text,
        date: new Date()
    });
    
    messageObj.save(function(err,result){
        if(err){
            console.log("Something went wrong");
            result = "Something went wrong while saving the Message"
        }

        callback(err,result)
    });

}

Message.prototype.findAll = function(callback){
    MessageCollection.find().exec(function(err,messages){
        callback(err,messages)
    })
}

module.exports = Message;