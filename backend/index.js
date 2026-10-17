import express from 'express'
import { connectDb } from './database/db.js'; 

import 'dotenv/config' 
const app = express()

const PORT = process.env.PORT || 3000

app.listen(PORT , ()=>{
    connectDb()
    console.log(`Server is listening at port ${PORT}`);
    
})

//mongodb+srv://<db_username>:GFoPHTloF3P22rHT@authentication-project.loxb5la.mongodb.net/