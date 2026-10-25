import mongoose from 'mongoose'

const sessionSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
})
export const session = mongoose.model("session" , sessionSchema)