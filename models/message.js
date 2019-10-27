(function () {
    var mongoose = require('mongoose')
      , Schema = mongoose.Schema
      , messageSchema = new Schema({
        userName: {type: String,required:true},
        text: {type: String,required:true},
        date: {type: Date,required:true}
    })
    exports.message = mongoose.model('message', messageSchema, 'message');
}).call(this);