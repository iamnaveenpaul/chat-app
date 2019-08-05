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

User.prototype.checkUserNameExists = checkUserNameExists;


function checkUserNameExists(req, res, next){

    var userName = req.query?req.query.userName:req.body.userName;

    if(userName){
        UserCollection.findOne({userName:userName}).lean().exec(function(err,user){
            if(user && user.userName){
                console.log("Username found!");
            } else {
                console.log("Username not found");
            }
            next();
        })
    } else {
        next();
        console.log("No params found for querying");
    }
}

module.exports = User;