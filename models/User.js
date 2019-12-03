const mongoose = require('mongoose')

const schema = mongoose.Schema;

const bcrypt = require('bcryptjs')

const userSchema = schema({
    name:{
        type:String
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String
        ,
        required:true
    }
})


const User = module.exports = mongoose.model("users",userSchema);

module.exports.createUser = function (newUser, callBack){
    bcrypt.genSalt(10, function(err,salt){
        bcrypt.hash(newUser.password, salt, function(err, hash){
            newUser.password = hash;
            newUser.save(callBack);
        })
    })
}


module.exports.getUserByEmail = function(email, callBack){
    var query = {email:email};
    User.findOne(query,callBack)
}

module.exports.getUserById = function(id,callBack){
    User.findById(id,callBack)
}


module.exports.comparePassword = function(candidatePassword, hash, callBack){
    bcrypt.compare(candidatePassword,hash, function(err, isMatch){
        if(err) throw err;
        callBack(null,isMatch)
    })
}