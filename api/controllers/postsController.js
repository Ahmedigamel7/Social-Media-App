import db from "../helpers/dbConnection.js";
import util from "util";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getPosts = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("need to log in");
    const userId = req.query.userId;
    const verify = util.promisify(jwt.verify).bind(jwt);
    const data = await verify(token, "secretkey");

       const query = util.promisify(db.query).bind(db);
const  getAllPostsQuery=
    userId !== "undefined"
      ? `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) WHERE p.userId = ? ORDER BY p.createdAt DESC`
      : `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId)
  LEFT JOIN follow AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId= ? OR p.userId =?
  ORDER BY p.createdAt DESC`;

    const values =
      userId !== "undefined" ? [userId] : [data.id, data.id];
    const result = await query(getAllPostsQuery, values);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
  // const userId = req.query.userId;
  // const token = req.cookies.accessToken;
  // if (!token) return res.status(401).json("Not logged in!");

  // jwt.verify(token, "secretkey", (err, userInfo) => {
  //   if (err) return res.status(403).json("Token is not valid!");

  //   console.log(userId);

  //   const q =
  //   userId !== "undefined"
  //     ? `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) WHERE p.userId = ? ORDER BY p.createdAt DESC`
  //     : `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId)
  // LEFT JOIN follow AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId= ? OR p.userId =?
  // ORDER BY p.createdAt DESC`;

  // const values =
  //   userId !== "undefined" ? [userId] : [userInfo.id, userInfo.id];

  //   db.query(q, values, (err, data) => {
  //     if (err) return res.status(500).json(err);
  //     return res.status(200).json(data);
  //   });
  // });
};

export const addPost = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("need to log in");

    const verify = util.promisify(jwt.verify).bind(jwt);
    const data = await verify(token, "secretkey");

    const query = util.promisify(db.query).bind(db);
    const addPostQuery =
      "INSERT INTO posts (`desc`, `img`, `createdAt`, `userId`) VALUES (?)";
    const values = [
      req.body.desc,
      req.body.img,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      data.id,
    ];

    await query(addPostQuery, [values]);
    return res.status(201).json("post has been created");
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("need to log in");

    const verify = util.promisify(jwt.verify).bind(jwt);
    const data = await verify(token, "secretkey");

    const query = util.promisify(db.query).bind(db);
    const deletePostQuery = "DELETE FROM posts WHERE `id` = ? AND `userId` = ?";
    const values = [req.params.id, data.id];

    const result = await query(deletePostQuery, [values]);
    return result.affectedRows > 0
      ? res.status(200).json("deleted successfully")
      : res.status(403).json("not allowed");
  } catch (error) {
    next(error);
  }
};
