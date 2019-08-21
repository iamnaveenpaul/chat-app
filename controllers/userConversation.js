var UserCollection = require('../models/user').user;
var ConversationCollection = require('../models/conversation').conversation;
var GithubCollection = require('../models/github').github;

var http = require('https');
var request = require('request');


function UserConveration() {};

UserConveration.prototype.getAnalytics = function(callback){
    getUserData(function(err_user,users){
        getConversationData(function(err_conv,conversations){
            callback({
                err:null,
                result:combineData(users,conversations)
            });
        })
    })
}

UserConveration.prototype.getAnalyticsUsingOnlyLoops = function(callback){
    getUserData(function(err_user,users){
        getConversationData(function(err_conv,conversations){
            callback({
                err:null,
                result:combineDataUsingLoops(users,conversations)
            });
        })
    })
}

UserConveration.prototype.downloadGithubUsers = function(callback){

    var options = {
        host: 'api.github.com',
        path: 'https://api.github.com/users',
        method: 'GET',
        headers: {'user-agent': 'node.js'}
        };
        
        var request = http.request(options, function(response){
            var body = '';
            response.on("data", function(chunk){
                body += chunk.toString('utf8');
            });
            
            response.on("end", function(){
                callback(body);
                });
            });
            
            request.end();

}

UserConveration.prototype.getHashmaps = function(callback){
    getUserData(function(err_user,users){
        getConversationData(function(err_conv,conversations){
            callback({
                err:null,
                result:getHashMaps(users,conversations)
            });
        })
    })
}


function getHashMaps(users,conversations){
    var convHashMap = {}; 
    var userHashMap = {}; 
    
    conversations.forEach(function(el){
        if(convHashMap[el.userName]){
            convHashMap[el.userName].push(el)
        } else {
            convHashMap[el.userName] = [el]
        }
    });

    users.forEach(function(el){
        if(userHashMap[el.userName]){
            userHashMap[el.userName].push(el)
        } else {
            userHashMap[el.userName] = [el]
        }
    });

    return {
        userHashMap:userHashMap,
        convHashMap:convHashMap
    }

}

function getUserData(callback){
    UserCollection.find().exec(callback);
}

function getConversationData(callback){
    ConversationCollection.find().exec(callback);
}

function combineData(users,conversations){
    var data = [];
    var convHashMap = {}; 
    conversations.forEach(function(conv){
        if(convHashMap[conv.userName]){
            convHashMap[conv.userName].push(conv)
        } else {
            convHashMap[conv.userName] = [conv]
        }
    });

    users.forEach(function(user){

       if(convHashMap[user.userName]){
        data.push({
            "userName": user.userName,
            "emailId": user.emailId,
            "password": user.password,
            "fullName": user.fullName,
            "registeredDate": user.registeredDate,
            messages:convHashMap[user.userName]
        })
       } else {
        data.push({
            "userName": user.userName,
            "emailId": user.emailId,
            "password": user.password,
            "fullName": user.fullName,
            "registeredDate": user.registeredDate,
            messages:[]
        })
       }
    })

    return data;
}

function combineDataUsingLoops(users,conversations){
    var data = [];

    users.forEach(function(user){
        var messages = [];

        conversations.forEach(function(conv){
            if(conv.userName == user.userName){
                messages.push(conv)
            } 
        });

        data.push({
            "userName": user.userName,
            "emailId": user.emailId,
            "password": user.password,
            "fullName": user.fullName,
            "registeredDate": user.registeredDate,
            messages:messages
        })
    });

    return data;
}

module.exports = UserConveration;