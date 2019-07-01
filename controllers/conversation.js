var ConversationCollection = require('../models/conversation').conversation;

//Notice how the constructors or the class name starts with an uppercase letter.
//Thats the best practice.

function Conversation() {}

Conversation.prototype.storeConversation = function(data,callback){
    //Observe how we are referencing the Conversatoon Schema 
    // to create the conversation object before storing it.
    //  This ensures all the properties are filled in as required;
    
    var conversationObj = new ConversationCollection({
        userName: data.userName,
        text: data.text,
        date: new Date()
    });
    
    conversationObj.save(function(err,result){
        if(err){
            console.log("Something went wrong");
            result = "Something went wrong while saving the conversation"
        }

        callback(err,result)
    });

}

module.exports = Conversation;

//module.exports is the object that's actually returned as the result of a require call.