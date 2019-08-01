var ConversationCollection = require('../models/conversation').conversation;

//Notice how the constructors or the class name starts with an uppercase letter.
//Thats the best practice.

function Conversation() {}

Conversation.prototype.getAllConversations = function(callback){
    ConversationCollection
    .find({})
    .sort({date:1})
    .exec(function(err,result){
        callback(err,result)
    })
}

Conversation.prototype.getConversationsAnalytics = function(range,callback){

    var aggregationPipeline = [];

    var groupRange = "$month";

    if(range == "daily" || range == "day"){
        groupRange = "$day";
    } else if(range == "week" || range == "weekly"){
        groupRange = "$week";
    }
    
    var projection = {
        $project: {
            text: 1,
            date: 1,
            month: { $month: "$date" },
            day: { $dayOfYear: "$date" },
            week: { $week: "$date" },
            year: { $year: "$date" }
        }
    }

    var group = {
        $group: {
            _id: {
                range: groupRange,
                year: "$year"
            },
             totalMessages: { $sum: 1},
             messages: {
                 $push: {
                     text:"$text",
                     date: "$date"
                 }
             }
        }
    }

    aggregationPipeline.push(projection)
    aggregationPipeline.push(group)

    ConversationCollection
    .aggregate(aggregationPipeline)
    .exec(function(err,result){
        console.log(err);
        callback(err,result)
    })
}

Conversation.prototype.getConversationsForUser = function(userName,callback){
    ConversationCollection.find({userName:userName}).exec(function(err,result){
        callback(err,result)
    })
}

Conversation.prototype.searchConversationsForUser = function(userName,searchStr,callback){

    console.log(typeof userName);
    console.log(typeof callback);

    ConversationCollection.find({
        userName:userName,
        text:new RegExp(searchStr,"i")
    })
    .exec(function(err,result){
        callback(err,result)
    })
}

Conversation.prototype.searchConversationsForUserWithDate = function(userName,searchStr,date,callback){

    ConversationCollection.find({
        userName:userName,
        text:new RegExp(searchStr,"i"),
        date: {$gte: new Date(date)}
    })
    .exec(function(err,result){
        callback(err,result)
    })
}

Conversation.prototype.searchConversationsByDate = function(date,callback){

    ConversationCollection.find({
        date: {$gte: new Date(date)}
    })
    .exec(function(err,result){
        callback(err,result)
    })
}

Conversation.prototype.searchConversationsForUserBetweenDates = function(userName,searchStr,dateMin,dateMax,callback){

    ConversationCollection.find({
        userName:userName,
        text:new RegExp(searchStr,"i"),
        date: {$gte: new Date(dateMin),$lte:new Date(dateMax)}
    })
    .exec(function(err,result){
        callback(err,result)
    })
}

Conversation.prototype.updateUserName = function(existingUserName,newUserName,callback){

    ConversationCollection
    .update({userName:existingUserName},{$set:{userName:newUserName}},{multi:true})
    .exec(function(err,result){
        callback(err,result)
    })
}

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