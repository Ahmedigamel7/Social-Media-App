import { query, body, param } from "express-validator";

export const usernameValidtion = query('username', 'Invalid username.').notEmpty().bail().isString().bail()
    .isLength({ min: 6, max: 15 }).bail().matches(/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/);

export const getUserValidation = usernameValidtion;

export const putUserValidations = [
    usernameValidtion,
    body("name", "Invalid name. Please use only alphabetical characters.")
        .notEmpty().withMessage("Name is required")
        .bail().isString()
        .bail().isAlpha()
]

export const paramUsernameValidation = param('followedUsername', 'Invalid followedUsername.')
    .notEmpty().bail().isString().bail()
    .isLength({ min: 6, max: 15 }).bail().matches(/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/);

export const bodyUsernameValidation = body('followedUsername', 'Invalid followedUsername.')
    .notEmpty().bail().isString().bail()
    .isLength({ min: 6, max: 15 }).bail().matches(/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/);

export const queryUsernameValidation = query('followedUsername', 'Invalid followedUsername.')
    .notEmpty().bail().isString().bail()
    .isLength({ min: 6, max: 15 }).bail().matches(/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/);
