import { body } from "express-validator";
import db from "../helpers/dbConnection.js";
import util from "util";
const query = util.promisify(db.query).bind(db);

export const registerValidation = [
    body(
        "username",
        "Invalid username. Please use both alphabetical and numeric characters(letters A-Z, a-z, and numbers 0-9)."
    )
        .notEmpty().bail()
        .isLength({ min: 6, max: 15 })
        .withMessage(
            "Username must be between 6 and 15 alphabetical and numeric characters."
        )
        .matches(/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/).bail()
        .custom(async (value, { req }) => {
            try {
                const findUserQ = `SELECT id FROM users WHERE username = ?`;
                const user = await query(findUserQ, [value]);
                if (user.length > 0)
                    return Promise.reject(new Error("Username is already used."));
                return true;
            } catch (error) {
                console.log(error);
            }
        }),
    body("name", "Invalid name. Please use only alphabetical characters.")
        .notEmpty().bail()
        .withMessage("Name is required")
        .isString().bail()
        .isAlpha(),
    body(
        "email",
        "Invalid email. Please use only alphanumeric characters (letters A-Z, a-z, and numbers 0-9)."
    )
        .isEmail().bail()
        .custom(async (value) => {
            try {
                const q = `SELECT username FROM users WHERE email = ?`;
                const user = await query(q, [value]);
                if (user.length > 0)
                    return Promise.reject(new Error("Email exists already."));
                return true;
            } catch (error) {
                console.log(error);
            }
        })
        .normalizeEmail(),
    body(
        "password",
        "Password should be at least 10 characters long, 3 uppercase letters, 5 numbers, and include special characters."
    )
        .custom((value) => {
            const regex =
                /^(?=.*\d.*\d.*\d.*\d.*\d)(?=.*[A-Z].*[A-Z].*[A-Z])(?=.*[a-z].*[a-z].*[a-z])(?=.*[!@#$%^&*]).*$/;
            if (value && regex.test(value)) return true;
            else return false;
        })
        .trim(),
    body("confirmPassword")
        .custom((value, { req }) => {
            if (value && value === req.body.password) return true;
            else throw new Error("Passwords have to match!");
        })
        .trim(),
];

export const loginValidation = [
    body("username", "Invalid username.")
        .notEmpty().bail()
        .isLength({ min: 6, max: 15 }).bail()
        .matches(/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/),
    body("password", "Invalid username or password.").notEmpty().bail().isString().trim(),
];
