import db from "../helpers/dbConnection.js";
import bcrypt from "bcrypt";
import util from "util";
import jwt from "jsonwebtoken";
import moment from "moment";
import { validationResult } from "express-validator";

const query = util.promisify(db.query).bind(db);

export const register = async (req, res, next) => {
    const errors = validationResult(req).array();

    if (errors.length > 0) {
        const usernameConflictMsg = "Username is already used.";
        const emailConflictMsg = "Email exists already.";
        let statusCode = 409;

        const { path, msg } = errors[0];
        const error = { path, msg };

        if (error.path === `username` && error.msg === usernameConflictMsg);
        else if (error.path === `email` && error.msg === emailConflictMsg);
        else statusCode = 422;

        return res.status(statusCode).json(error);
    }

    try {
        const hashedPass = await bcrypt.hash(req.body.password, 13);
        const addUserQ =
            "INSERT INTO users (`username`, `email`, `password`, `name`, `createdAt`) VALUES (?)";
        const values = [req.body.username, req.body.email, hashedPass, req.body.name,
        moment(Date.now()).format("YYYY-MM-DD")];

        await query(addUserQ, [values]);
        return res.status(201).json("User has been created.");
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    const errors = validationResult(req).array();

    if (errors.length > 0) {
        const { path, msg } = errors[0];
        const error = { path, msg };
        return res.status(422).json(error);
    }

    try {
        const findUserQ = "SELECT * FROM users WHERE username = ?";
        const data = await query(findUserQ, [req.body.username]);
        if (data.length === 0) return res.status(404).json("User not found.");

        const isCorrectPass = await bcrypt.compare(
            req.body.password,
            data[0].password
        );
        if (!isCorrectPass)
            return res.status(400).json("Invalid username or password.");

        const { password, id, email, ...others } = data[0];

        const payload = { id, username: others.username };
        const sign = util.promisify(jwt.sign).bind(jwt);
        const token = await sign(payload, process.env.JWT_SECRET);

        res.cookie("auth_token", token, {
            httpOnly: true,
            maxAge: 60 * 1000,
        })
            .status(200)
            .json(others);
    } catch (error) {
        return next(error);
    }
}

export const logout = (req, res, next) => {
    return res
        .clearCookie("auth_token", { sameSite: "none", secure: true })
        .status(200)
        .json("user has been logged out");
};
