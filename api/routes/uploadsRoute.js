import express from 'express';
import multer from "multer";
const router = express.Router();

const postStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "../../client/public/upload/posts");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const storiesStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "../../client/public/upload/stories");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
})

const fileFilter = (req, file, cb) => {
    const error = new Error('Wrong mimetype.')
    if (file.mimetype.startsWith('image/'))
        cb(null, true);
    else
        cb(error, false);
}

const postsUpload = multer({ storage: postStorage, fileFilter: fileFilter }).single("img");
const storiesUpload = multer({ storage: storiesStorage, fileFilter }).single('img');

router.post("/posts", postsUpload, (req, res, next) => {
    const imgName = req?.file?.filename;
    if (imgName)
        res.status(200).json(imgName)
    else next(new Error('File not found'))
});

router.post('/stories', storiesUpload, (req, res) => {
    const imgName = req?.file?.filename;
    if (imgName)
        res.status(200).json(imgName)
    else next(new Error('File not found'))
})

export default router;