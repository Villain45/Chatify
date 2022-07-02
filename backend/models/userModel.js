const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    pic:{
        type:String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROCogmtRJ75OVqKFUgWFWyEF30zAV_r_1oRA&usqp=CAU"
    }
},
{
    timestamps:true
})



userSchema.methods.comparePassword =async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.pre('save', async function(next){
if(!this.isModified)
    next();
    const salt = await bcrypt.genSalt(10);
    this.password= await bcrypt.hash(this.password,salt);
})


const User=mongoose.model('User',userSchema);
module.exports = User;

