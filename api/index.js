import express from "express";
import dotenv from "dotenv";
dotenv.config();

// console.log(process.env.JWT_SECRET);
const app = express();
import usersRoute from "./routes/usersRoute.js";
import authRoutes from "./routes/authRoute.js";
import postsRoute from "./routes/postsRoute.js";
import likesRoute from "./routes/likesRoute.js";
import commentsRoute from "./routes/commentsRoute.js";
import relationships from "./routes/followsRoute.js";

import cookieParser from "cookie-parser";
import cors from "cors";
import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "../client/public/upload");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const upload = multer({ storage: storage });

//Middlerwares
app.use((req, res, next) => {
    res.header("Access-control-Allow-Credentials", true);
    next();
}, cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());

app.post("/api/upload", upload.single("file"), (req, res) => {
    // console.log("file",req.file)
    const file = req.file;
    res.status(200).json(file.filename);
});
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoute);
app.use("/api/posts", postsRoute);
app.use("/api/likes", likesRoute);
app.use("/api/comments", commentsRoute);
app.use("/api/relationships", relationships);
app.use((err, req, res, next) => {
    return res.status(err.status || 500).json(err);
});
app.listen(8800, () => {
    console.log("API is working");
});
