import express from 'express'
import { connectDb } from './database/db.js'; 
import userRoute from './routes/userroute.js'
import 'dotenv/config' 


const app = express()

app.use(express.json())
app.use('/user' , userRoute)


const PORT = process.env.PORT || 3000
app.listen(PORT , ()=>{
    connectDb()
    console.log(`Server is listening at port ${PORT}`);
    
})

//mongodb+srv://<db_username>:GFoPHTloF3P22rHT@authentication-project.loxb5la.mongodb.net/