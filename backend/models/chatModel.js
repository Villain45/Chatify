const mongoose = require('mongoose');

const chatModel=mongoose.Schema({
    chatName:{type:String,trim:true},
    isGroupChat:{type:Boolean,default:false},
    users:[{
        type:mongoose.Schema.Types.ObjectId,        //Users related are always accessed by id
        ref:"User",                                 // Refering to 
    }],
    latestMessage:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Message",
    },
    groupAdmin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }
},
{
    timestamps:true //for recent messages
}
)

const Chat=mongoose.model('Chat',chatModel)

module.exports = Chat