import { body, param } from "express-validator";


export const postPostValidations = [
    body('desc').isString().bail()
        .isLength({ max: 500 }).withMessage('maximum length is 500 charachters.').bail()
        .custom((value, { req }) => {
            if (req.body.img === 'undefined' && value.length === 0)
                throw new Error('Please provide an image or description or both.');
            return true;

        })
    , body('img', 'Invalid image URL.').optional().notEmpty().bail().isString()
]

export const paramValidation = param('postId', 'Invalid postId').notEmpty().bail().isString().trim();

export const bodyPostIdValidation = body('postId', 'Invalid postId').notEmpty().bail().isString().trim();

export const postCommentValidatoins = [
    bodyPostIdValidation,
    body("desc").notEmpty().isString()
        .bail().isLength({ max: 200 }).withMessage('maximum length is 200 charachters.')
]