import { verifyMail } from '../email-verify/verify-email.js'
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

export const verification = async (req, resp) => {
    try {
        const authheaders = req.headers.authorization
        if (!authheaders || !authheaders.startsWith('Bearer ')) {
            return resp.status(401).json({
                succes: false,
                message: "Authorization token is missing or invalid"
            })
        }

        const token = authheaders.split(" ")[1]
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY)
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return resp.status(400).json({
                    success: false,
                    message: "The registration token had expired"
                })
            }
            return resp.status(400).json({
                success: false,
                message: "token verification failed"
            })
        }


        const foundUser = await user.findById(decoded.id)

        if (!foundUser) {
            return resp.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        foundUser.token = null
        foundUser.isVerified = true
        await foundUser.save()
        return resp.status(200).json({
            success: true,
            message: "email verified successfully"
        })
    } catch (error) {
        return resp.status(500).json({
            success: false,
            message: error.message
        })
    }
}