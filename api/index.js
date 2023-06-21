import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();
import usersRoute from "./routes/usersRoute.js";
import authRoutes from "./routes/authRoute.js";
import postsRoute from "./routes/postsRoute.js";
import relationships from "./routes/followsRoute.js";

import cookieParser from "cookie-parser";
import cors from "cors";
import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "../../client/public/upload");
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
    const file = req.file;
    res.status(200).json(file.filename);
});

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoute);
app.use("/api/posts", postsRoute);
app.use("/api/relationships", relationships);

app.use((err, req, res, next) => {
    console.log(err)
    const error = { status: err.status || 500, msg: "Something went wrong!" }
    return res.status(error.status).json(error);
});

app.listen(8800, () => {
    console.log("API is working");
});
