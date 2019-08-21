(function () {
    var mongoose = require('../node_modules/mongoose')
      , Schema = mongoose.Schema
      , githubSchema = new Schema({
        "login": {type: String},
        "id": {type: Number},
        "node_id": {type: String},
        "avatar_url": {type: String},
        "gravatar_id": {type: String},
        "url": {type: String},
        "html_url": {type: String},
        "type": {type: String},
        "site_admin": {type: String},
    })
    exports.github = mongoose.model('github', githubSchema, 'github');
}).call(this);