const mongoose = require('mongoose')
const validator = require( 'validator' )
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
            trim:true,
            lowercase:true,
            validate(value){
                if(!validator.isEmail(value))
                    throw  new Error("Invalid Email")
            }
        },
        password:{
            type:String,
            required:true,
            trim:true,
            minlength:8,
            validate(value){
                if(!validator.isStrongPassword(value))
                    throw  new Error("Password should contain atleast one uppercase and lowercase letter, number and special character")
            }
        },
    },
    {
        timestamps: true
    }
)
userSchema.statics.isEmailTaken= async function(email){
    const user= await this.findOne({email})
    // returns boolean
    return !!user;
}
userSchema.pre('save', async function(next){
    const user = this
    if(user.isModified('password')){
        user.password= bcrypt.hash(user.password,8);
    };
    next()
})
userSchema.methods.isPasswordMatch= async function(password){
    const User= this
    return bcrypt.compare(user.password,userSchema)
}

const User = mongoose.model( 'User', userSchema )  
module.exports= User;