const mongoose=require('mongoose');

const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
    },email:{
        type:String,
        required:true,
        unique:true,
    },
    userid:{
        type:String,
        required:true,
        unique:true,
    },
    pass:{
        type:String,
        required:true,
    },
});



const User=mongoose.model('USER',userSchema);
module.exports=User;