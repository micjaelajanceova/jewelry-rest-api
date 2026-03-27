// External dependencies
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Joi, {ValidationResult, func} from "joi";

// Project imports
import { UserModel } from "../models/userModel";
import { User } from "../interfaces/user";
import { connect, disconnect } from "../repository/database";

/**
 * Registers a new user account.
 * @param req
 * @param res
 * @returns
 */


export async function registerUser(req: Request, res: Response) {


try {

    const {error} = validateUserRegistrationData(req.body);

    if (error) {
        res.status(400).json({
           error: error.details[0].message
        });
        return;
    }

    await connect();

    const existingUser = await UserModel.findOne({email: req.body.email});

    if (existingUser) {
        res.status(409).json({
            error: "Email already exists."
        });
        return;
    }



    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);


    const newUser = new UserModel({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        registeredAt: new Date()
    });

    const createdUser = await newUser.save();
    res.status(201).json({
        message: "User registered successfully.",
        data: createdUser._id
    })

}



catch (err) {
    res.status(500).json({
      message: "Registration failed.",
      error: err instanceof Error ? err.message : err
    });

} 

finally {
    await disconnect();
}


};


/**
 * Logs in a user
 * @param res
 * @returns
 */

export async function loginUser(req: Request, res: Response) {

    try {
        const {error} = validateUserLoginData(req.body);

        if (error) {
            res.status(400).json({
                error: error.details[0].message
            });
            return;
        }

        await connect();

        const user: User | null = await UserModel.findOne({email: req.body.email});

        if (!user) {
            res.status(401).json({
                error: "Invalid email or password."
            });
            return;
        }

        const validPassword: boolean = await bcrypt.compare(req.body.password, user.password);

        if (!validPassword) {
            res.status(401).json({
                error: "Invalid email or password."
            });
            return;
        }

        const userID: string = user.id;
        const token: string = jwt.sign({id: userID, name: user.name, email: user.email}, process.env.TOKEN_SECRET || "default_secret_key", {expiresIn: "1h"});

        res.status(200).header("Authorization", token).json({ error: null, data: {userID, token} });

    }

    catch (err) {
        res.status(500).json({
            message: "Login failed.",
            error: err instanceof Error ? err.message : err
        });
    }
};




/**
 * Middleware to verify JWT token and authenticate user.
 * @param req
 * @param res
 * @param next
 */

export function authenticateToken(req: Request, res: Response, next: NextFunction) {

const token = req.header("Authorization")?.replace("Bearer ", "");

if (!token) {
    res.status(401).json({
        error: "Access denied. No token provided."
    });
    return;
}

try {
    if (token)
    jwt.verify(token, process.env.TOKEN_SECRET as string);
    next();
}

catch (err) {
    res.status(400).json({
        error: "Invalid token."
    });
}


};

/**
 * Validates user registration data using Joi schema.
 * @param data 
 */

export function validateUserRegistrationData(data: User): ValidationResult {

    const schema = Joi.object({
        name: Joi.string().min(6).max(100).required(),
        email: Joi.string().min(6).max(255).required().email(),
        password: Joi.string().min(6).max(255).required()
    });

    return schema.validate(data);
}

/**
 * Validates user registration data using Joi schema.
 * @param data 
 */

export function validateUserLoginData(data: User): ValidationResult {

    const schema = Joi.object({
        email: Joi.string().min(6).max(255).required().email(),
        password: Joi.string().min(6).max(255).required()
    });

    return schema.validate(data);
}