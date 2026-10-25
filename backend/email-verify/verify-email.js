import path from 'path'
import fs from 'fs'
import 'dotenv/config'
import nodemailer from 'nodemailer'
import { fileURLToPath } from 'url'
import handlebars from 'handlebars'

// __dirname doesn't exist in ES modules, so recreate it
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const verifyMail = async (token, email) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    })

    // read, compile and render the .hbs template
const templatePath = path.join(__dirname, 'email-template.hbs')
const source = fs.readFileSync(templatePath, 'utf-8')
const template = handlebars.compile(source)
 const verificationUrl =
    `${process.env.APP_URL}/verify?token=${encodeURIComponent(token)}`

const htmlToSend = template({
    appName: process.env.APP_NAME || 'Certify',
    verificationUrl
})
    //mail configuration
    const mailoption = {
        from: process.env.MAIL_USER,
        to: email,
        subject: "Verify Your Email",
        html: htmlToSend,
    }

    transporter.sendMail(mailoption, function (error, info) {
        if (error) {
            throw new Error(error)
        }
        console.log("Email Send Successfully")
        console.log(info)
    })
}