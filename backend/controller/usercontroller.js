import { verifyMail } from '../email-verify/verify-email.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { user } from '../models/usermodel.js';
import { session } from '../models/sessionmodel.js'
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

export const login = async (req, resp) => {
    try {
        //if all fields are not given
        const { email, password } = req.body
        if (!email || !password) {
            return resp.status(400).json({
                success: false,
                message: "ALL FIELDS ARE REQUIRED"
            })
        }

        //finding user by email in db
        const userFind = await user.findOne({ email })
        if (!userFind) {
            return resp.status(401).json({
                success: false,
                message: "Unauthorized access"
            })
        }
        //checking passwoord
        const passwordcheck = await bcrypt.compare(password, userFind.password)
        if (!passwordcheck) {
            return resp.status(402).json({
                success: false,
                message: "incorrect pass"
            })
        }
        //checking if user is verified
        if (userFind.isVerified != true) {
            return resp.status(203).json({
                success: false,
                message: "verify Your account then login"
            })
        }
        //checking if any session exist if yes then delete it
        const existingSession = await session.findOne({ userId: userFind._id })
        if (existingSession) {
            await session.deleteOne({ userId: userFind._id })
        }
        //creating an new session 
        await session.create({ userId: userFind._id })

        //generation tokens
        const accestoken = jwt.sign({ id: userFind._id }, process.env.SECRET_KEY, { expiresIn: "10d" })
        const refreshtoken = jwt.sign({ id: userFind._id }, process.env.SECRET_KEY, { expiresIn: "20d" })

        userFind.isLogin = true
        await userFind.save()

        return resp.status(200).json({
            success: true,
            message: `Welcome Back ${userFind.username}`,
            accestoken,
            refreshtoken,
            userFind

        })
    } catch (error) {
return resp.status(500).json({
    success:false,
    message:error.message
})
    }
}

export const logout = async(req,  resp)=>{
    try {
        const userid = req.userId
        await session.deleteMany({ userId: userid })
        await user.findByIdAndUpdate(userid , {isLogin:false})
        return resp.status(200).json({
            success:true,
            message:"Logout successfully"
        })
        
    } catch (error) {
       return resp.status(500).json({
        success:false,
        message:error.message
       })
    }
}