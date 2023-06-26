import db from "../helpers/dbConnection.js";
import util from "util";
import moment from "moment";
import { validationResult } from "express-validator";

const query = util.promisify(db.query).bind(db);

export const getPosts = async (req, res, next) => {
  try {
    const username = req.query.username;
    if (username != 'undefined' && username?.length < 6 || username?.length > 15)
      return res.status(400).end();

    const getAllPostsQuery = (username != 'undefined') ? `SELECT p.*, u.name, u.profilePic FROM posts AS p JOIN users AS u ON 
           (u.username = p.username) WHERE p.username = ? ORDER BY p.createdAt DESC`
      : `SELECT p.*, u.name, u.profilePic FROM posts AS p JOIN users AS u ON (u.username = p.username)  LEFT JOIN relationships AS r
              ON (p.username = r.followedusername) WHERE r.followerUsername= ? OR p.username =? ORDER BY p.createdAt DESC`;

    const values = username != 'undefined' ? [username] : [req.username, req.username];
    const result = await query(getAllPostsQuery, values);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const addPost = async (req, res, next) => {
  const errors = validationResult(req).array();

  if (errors.length > 0) {
    const { msg } = errors[0];
    const error = { msg };
    return res.status(422).json(error);
  }

  try {
    const addPostQuery =
      "INSERT INTO posts (`desc`, `img`, `createdAt`, `username`) VALUES (?)";
    const values = [
      req.body.desc,
      req.body.img,
      moment(Date.now()).local(true).format("YYYY-MM-DD HH:mm:ss"),
      req.username,
    ];

    const result = await query(addPostQuery, [values]);
    return result.affectedRows > 0
      ? res.status(201).end()
      : res.status(404).end();
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  if (validationResult(req).array().length > 0)
    return res.status(400).end();

  try {
    const deletePostQuery = "DELETE FROM posts WHERE `id` = ? AND `username` = ?";
    const values = [req.params.postId, req.username];

    const result = await query(deletePostQuery, values);
    return result.affectedRows > 0
      ? res.status(204).end()
      : res.status(404).end();
  } catch (error) {
    next(error);
  }
};
