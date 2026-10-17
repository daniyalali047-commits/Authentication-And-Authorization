
import nodemailer from "nodemailer";
export const verifyMail = async(token , email)=>{
const transporter = nodemailer.createTransport({
   service:"gmail",
   auth:{
    
   }
})
}