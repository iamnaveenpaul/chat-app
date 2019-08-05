(function () {
    var mongoose = require('../node_modules/mongoose')
      , Schema = mongoose.Schema
      , userSchema = new Schema({
        userName: {type: String,required:true,unique:true},
        emailId: {type: String,required:true},
        fullName: {type: String,required:true},
        password: {type: String,required:true},
        registeredDate: {type: Date,required:true}
    })
    exports.user = mongoose.model('user', userSchema, 'user');
}).call(this);