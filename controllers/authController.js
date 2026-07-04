import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {

    try {

        const { name, username, email, password } = req.body;

        const existingUser = await User.findOne({
            email
        });
        if (existingUser) {

            return res.status(400).json({
                message: "Email already exists"
            });

        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({

            name,

            username,

            email,

            password: hashedPassword

        });

        user.password = undefined;

        res.status(201).json({

            message: "User Registered Successfully",

            user

        });


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

export const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {

            return res.status(400).json({
                message: "Invalid Email"
            });

        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {

            return res.status(400).json({
                message: "Invalid Password"
            });

        }
        const token = jwt.sign(

            {
                id: user._id
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "7d"
            }

        );
        user.password = undefined;

        res.status(200).json({

            message: "Login Successful",

            token,

            user

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};
export const getMe = async (req, res) => {

    res.status(200).json(req.user);

};