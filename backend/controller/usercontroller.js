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

        const existingUser = await user.findOne((email))

        if (existingUser) {
            return resp.status(400).json({
                succes: false,
                message: "User already exist here"
            })
        }

        const newuser = await user.craete({
            username,
            email,
            password,
        })

        return resp.status(201).json({
            success: true,
            messgae: "User created succesfully",
            data: newuser
        })


    } catch (error) {
        return resp.status(500).json({
            success: false,
            Message: error.Message
        })

    }
}