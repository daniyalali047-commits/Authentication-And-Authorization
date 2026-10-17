import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username:{type:String , required:true},
     email:{type:String , required:true , unique:true},
     password:{type:String , required:true},
     isVerified:{type:Boolean , default:false},
     isLogin:{type:Boolean , default:false},
     token:{type:String , default:null},
     OTPVerification:{type:Stirng , default:null},
     OTPExpiry:{type:Date , default:null},

},{tiemStamps:true})

export const user = mongoose.model("User" , userSchema)