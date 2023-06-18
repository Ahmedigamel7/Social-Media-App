import db from "../helpers/dbConnection.js";
import util from "util";
import jwt from "jsonwebtoken";

export const getLikes = async (req, res, next) => {
     try {
          const token = req.cookies.accessToken;
          if (!token) return res.status(401).json("need to log in");

          const verify = util.promisify(jwt.verify).bind(jwt);
          const data = await verify(token, "secretkey");

          const query = util.promisify(db.query).bind(db);
          const getCommentsQuery = `SELECT userId FROM likes WHERE postId = ? `;

          const result = await query(getCommentsQuery, [req.query.postId]);
          return res.status(200).json(result.map((like) => like.userId));
     } catch (error) {
          next(error);
     }
};

export const addLike = async (req, res, next) => {
     try {
          const token = req.cookies.accessToken;
          if (!token) return res.status(401).json("need to log in");

          const verify = util.promisify(jwt.verify).bind(jwt);
          const data = await verify(token, "secretkey");

          const query = util.promisify(db.query).bind(db);
          const addLikeQuery =
               "INSERT INTO likes (`postId` , `userId`) VALUES (?)";
          const values = [req.body.postId, data.id];

          const result = await query(addLikeQuery, [values]);
          return res.status(200).json("like added");
     } catch (error) {
          next(error);
     }
};

export const deleteLike = async (req, res, next) => {
     try {
          const token = req.cookies.accessToken;
          if (!token) return res.status(401).json("need to log in");

          const verify = util.promisify(jwt.verify).bind(jwt);
          const data = await verify(token, "secretkey");

          const query = util.promisify(db.query).bind(db);
          const deleteLikeQuery =
               "DELETE FROM likes WHERE `postId` = ? AND `userId` = ?";
          const values = [req.query.postId, data.id];

          const result = await query(deleteLikeQuery, [values]);
          return res.status(200).json("like deleted");
     } catch (error) {
          next(error);
     }
};
