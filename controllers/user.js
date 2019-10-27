var UserCollection = require('../models/user').user;

function User() {};

User.prototype.storeUser = function(data,callback){

    var userObj = new UserCollection({
        userName: data.userName,
        emailId: data.emailId,
        password: data.password,
        fullName: data.fullName,
        registeredDate: new Date()
    });
    
    userObj.save(function(err,result){
        if(err){
            console.log("Something went wrong");
            result = "Something went wrong while saving the user"
        }

        callback(err,result)
    });

}

User.prototype.findAllUsers = function(callback){
    UserCollection.find({},function(err,result){
        callback(err,result);
    })
}

User.prototype.findUsersByName = function(name,callback){
    console.log(name);
    UserCollection.find({fullName:new RegExp(name,'i')},function(err,result){
        callback(err,result);
    })
}

User.prototype.updateFullNameByUserName = function(userName,fullName,callback){
    console.log(userName);
    console.log(fullName);
    
    UserCollection.update({userName:userName},{$set:{fullName:fullName}},function(err,result){
        callback(err,result);
    })
}

module.exports = User;