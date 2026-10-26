import jwt from 'jsonwebtoken'
import { user } from "../models/usermodel.js"

export async function isAuthenticated(req, resp, next) {
    try {
        const authheader = req.headers.authorization

        if (!authheader || !authheader.startsWith("Bearer")) {
            return resp.status(401).json({
                success: false,
                message: "Access token is missing or invalid"
            })
        }

        const token = authheader.split(" ")[1]

        jwt.verify(token, process.env.SECRET_KEY, async (error, decoded) => {
            if (error) {
                if (error.name === "TokenExpiredError") {
                    return resp.status(400).json({
                        success: false,
                        message: "Access token has expired, use refresh token to generate new one"
                    })
                }
                return resp.status(400).json({
                    success: false,
                    message: "Access token is missing or invalid"
                })
            }

            const { id } = decoded
            const foundUser = await user.findById(id)

            if (!foundUser) {
                return resp.status(404).json({
                    success: false,
                    message: "User not found"
                })
            }

            req.userId = foundUser._id
            next()
        })

    } catch (error) {
        return resp.status(500).json({
            success: false,
            message: error.message
        })
    }
}