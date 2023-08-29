const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const Schema = mongoose.Schema

const userSchema= new Schema({
    username:{
        type:String,
        required:true
    },
    department:{
        type:String,
        required:true
    },
    fname:{
        type:String,
    },
    lname:{
        type:String,
    },
    salesTarget:{
        type:String,
    },
    image:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    jobtitle:{
        type:String,
    },
    employeeId:{
        type:String,
    },
    mobile:{
        type:String,
    },
    address:{
        type:String,
    },
    emergency:{
        type:String,
    },
    password:{
        type:String,
        required:true
    }
}, {timestamps: true});

userSchema.pre('save', async function (next){
    if(!this.isModified('password')){
        next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.matchPasswords = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model('Users', userSchema)

module.exports = User 