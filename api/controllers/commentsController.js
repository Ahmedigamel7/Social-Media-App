import db from "../helpers/dbConnection.js";
import jwt from "jsonwebtoken";
import moment from "moment";
import util from "util";

export const getComments = async (req, res, next) => {
     try {
          const query = util.promisify(db.query).bind(db);
          const getCommentsQuery = `SELECT c.*, u.id AS userId, name, profilePic FROM comments AS c JOIN users AS u ON (c.userId= u.id) 
              WHERE c.postId = ? ORDER BY c.createdAt DESC`;
            

          const result = await query(getCommentsQuery, [req.query.postId]);
          return res.status(200).json(result);
     } catch (error) {
          next(error);
     }
};

export const addComment = async (req, res, next) => {
     try {
          const token = req.cookies.accessToken;
          if (!token) return res.status(401).json("need to log in");

          const verify = util.promisify(jwt.verify).bind(jwt);
          const data = await verify(token, "secretkey");

          const query = util.promisify(db.query).bind(db);
          const addCommentQuery =
               "INSERT INTO comments (`desc`, `postId`, `createdAt`, `userId`) VALUES (?)";
          const values = [
               req.body.desc,
               req.body.postId,
               moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
               data.id,
          ];

          const result = await query(addCommentQuery, [values]);
          return res.status(200).json(result);
     } catch (error) {
          next(error);
     }
};
