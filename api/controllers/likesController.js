import { validationResult } from "express-validator";
import db from "../helpers/dbConnection.js";
import util from "util";

const query = util.promisify(db.query).bind(db);

export const getLikes = async (req, res, next) => {
     if (validationResult(req).array().length > 0)
          return res.status(400).end();

     try {
          const getLikesQuery = `SELECT username FROM likes WHERE postId = ?`;
          const likes = await query(getLikesQuery, [req.params.postId]);
          const users = likes.map((like) => like.username)
          return res.status(200).json(users);
     } catch (error) {
          next(error);
     }
};

export const addLike = async (req, res, next) => {
     if (validationResult(req).array().length > 0)
          return res.status(400).end();

     try {
          const addLikeQuery = "INSERT INTO likes (`postId` , `username`) VALUES (?)";
          const values = [req.body.postId, req.username];

          const result = await query(addLikeQuery, [values]);
          return result.affectedRows === 1 ?
               res.status(201).end() :
               res.status(404).end();
     } catch (error) {
          next(error);
     }
};

export const deleteLike = async (req, res, next) => {
     if (validationResult(req).array().length > 0)
          return res.status(400).end();

     try {
          const deleteLikeQuery = "DELETE FROM likes WHERE  `username` = ? AND `postId` = ?";
          const values = [req.username, req.params.postId];
          const result = await query(deleteLikeQuery, values);
          return result.affectedRows === 1 ?
               res.status(204).end() :
               res.status(404).end();
     } catch (error) {
          next(error);
     }
};
