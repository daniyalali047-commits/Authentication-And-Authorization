import mongoose from 'mongoose'
 export const connectDb = async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/note-app`)
        console.log("Mongo db connected succesfully");
        
    } catch (error) {
        console.log("Mongo db connection failed " , error);
        
    }
}

