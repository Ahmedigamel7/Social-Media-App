import { query, body, param } from "express-validator";

export const postPostsValidations = [
    body('desc').isString().bail()
        .isLength({ max: 500 }).withMessage('maximum length is 500 charachters.').bail()
        .custom((value, { req }) => {
            if (req.body.img === undefined && value.length === 0)
                return new Error('Please provide an image or description or both.');
            return true;

        })
    , body('img', 'Invalid image URL.').optional().notEmpty().bail().isString()
]

export const deletePostsValidations = param('postId').isInt({ allow_leading_zeroes: false, gt: 0 })