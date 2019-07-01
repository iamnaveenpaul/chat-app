/*
 Conversation Schema. Even though MongoDb has no structure for storing data,
  its a good practice, in fact its necessary to create a schema that your teammates can refer to when
  debugging the app. To implement the structure, we will be using Mongoose module. 
 */

(function () {
    var mongoose = require('../node_modules/mongoose')
      , Schema = mongoose.Schema
      , conversationSchema = new Schema({
        userName: {type: String,required:true},
        text: {type: String,required:true},
        date: {type: Date,required:true}
    })
    exports.conversation = mongoose.model('conversation', conversationSchema, 'conversation');
}).call(this);


/*
1. Observe how we are using IIFE to execute this piece of code.
2. As an assignemnt, read why "call" and "this" keyword are used here.
*/