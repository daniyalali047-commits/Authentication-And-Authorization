import {verifyMail} from '../email-verify/verify-email.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { user } from '../models/usermodel.js';
export const registerUser = async (req, resp) => {
    try {
        const { username, email, password } = req.body

        if (!username || !email || !password) {
            return resp.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const existingUser = await user.findOne({ email })

        if (existingUser) {
            return resp.status(400).json({
                succes: false,
                message: "User already exist here"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10)

        const newuser = await user.create({
            username,
            email,
            password: hashedPassword
        })

        const token = await jwt.sign({ id: newuser._id }, process.env.SECRET_KEY, { expiresIn: "10m" })
        verifyMail(token, email)
        newuser.token = token
        await newuser.save()
        return resp.status(201).json({
            success: true,
            messgae: "User created succesfully",
            data: newuser
        })


    } catch (error) {
        return resp.status(500).json({
            success: false,
            message: error.message
        })

    }
}