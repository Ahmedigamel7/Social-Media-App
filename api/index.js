import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();
import usersRoute from "./routes/usersRoute.js";
import authRoutes from "./routes/authRoute.js";
import postsRoute from "./routes/postsRoute.js";
import relationships from "./routes/followsRoute.js";
import stories from "./routes/storiesRoute.js";
import uploads from './routes/uploadsRoute.js'
import cookieParser from "cookie-parser";
import cors from "cors";

//Middlerwares
app.use((req, res, next) => {
    res.header("Access-control-Allow-Credentials", true);
    next();
}, cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/uploads', uploads)
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoute);
app.use("/api/posts", postsRoute);
app.use("/api/relationships", relationships);
app.use("/api/stories", stories);


app.use((err, req, res, next) => {
    const error = { status: err.status || 500, msg: "Something went wrong!" }
    res.status(error.status).json(error);
});

app.listen(8800, () => {
    console.log("API is working");
});
