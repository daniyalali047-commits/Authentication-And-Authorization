import path from 'path'
import 'dotenv/config'
import nodemailer from "nodemailer";
import { fileURLToPath } from 'url';
import handlebars from 'handlebars'


export const verifyMail = async(token , email)=>{
const transporter = nodemailer.createTransport({
   service:"gmail",
   auth:{
    user:process.env.MAIL_USER,
    pass:process.env.MAIL_PASS
   }

})
//mail configuration
const mailoption = {
   from:process.env.MAIL_USER,
   to:email,
   subject:"Verify Your Email",
   html:"<h1>Testing-Email</h1>"
}
transporter.sendMail(mailoption , function(error , info){
 if(error){
   throw new error(error)
 }
 cosole.log("Email Send Successfully")
 console.log(info);
 
})

}