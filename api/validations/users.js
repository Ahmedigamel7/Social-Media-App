import { query, body } from "express-validator";

const usernameURLQuery = query('username', 'Invalid username.').notEmpty().bail().isString().bail()
    .isLength({ min: 6, max: 15 }).bail().matches(/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/);

export const getUserValidation = usernameURLQuery;

export const putUserValidations = [
    usernameURLQuery,
    body("name", "Invalid name. Please use only alphabetical characters.")
        .notEmpty().withMessage("Name is required")
        .bail().isString()
        .bail().isAlpha()
]