import express from 'express';
import zod from 'zod';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../configuration.js';
import { expense, user } from '../db.js';
import { middleware } from '../middleware.js';

const userRouter = express.Router(); 


const Signup = zod.object({
    username: zod.string(),
    firstname: zod.string(),
    lastname: zod.string(),
    password: zod.string(),
});

const Signin = zod.object({
    username: zod.string(),
    password: zod.string(),
});

const Update = zod.object({
    password: zod.string().optional(),
    firstname: zod.string().optional(),
    lastname: zod.string().optional(),
});

userRouter.post('/signup', async (req, res) => {
    const body = Signup.safeParse(req.body);
    if (!body.success) {
        return res.status(400).json({ message: 'Invalid inputs' });
    }

    const existingUser = await user.findOne({ username: req.body.username });
    if (existingUser) {
        return res.status(409).json({ message: 'Username already taken' });
    }

    const newUser = await user.create({
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password: req.body.password, 
    });

    const userId = newUser._id;

    const token = jwt.sign(
        {
            userId: userId,
        },
        JWT_SECRET
    );

    res.status(201).json({
        success: true,
        message: 'User created successfully',
        token: token,
    });
});


userRouter.post('/signin', async (req, res) => {
    const load = Signin.safeParse(req.body);
    if (!load.success) {
        return res.status(400).json({ success: false, message: 'Invalid login inputs' });
    }

    const foundUser = await user.findOne({
        username: req.body.username,
        password: req.body.password, 
    });

    if (!foundUser) {
        return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    const token = jwt.sign(
        { userId: foundUser._id },
        JWT_SECRET
    );

    res.json({
        success: true,
        message: "Login successful!",
        token,
        user: {
            id: foundUser._id,
            username: foundUser.username,
            firstname: foundUser.firstname,
            lastname: foundUser.lastname
        }
    });
});
userRouter.post('/logout', (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });

    res.status(200).json({ success: true, message: "Logout successful" });
});

export { userRouter };
