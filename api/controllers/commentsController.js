import db from "../helpers/dbConnection.js";
import moment from "moment";
import util from "util";
import { validationResult } from "express-validator";

const query = util.promisify(db.query).bind(db);

export const getComments = async (req, res, next) => {
     if (validationResult(req).array().length > 0)
          return res.status(400).end();

     try {
          const getCommentsQuery = `SELECT c.*, u.username AS username, name, profilePic FROM 
             comments AS c JOIN users AS u ON (c.username= u.username) WHERE c.postId = ? ORDER BY c.createdAt DESC`;
          const comments = await query(getCommentsQuery, [req.params.postId]);
          res.status(200).json(comments);
     } catch (error) {
          next(error);
     }
};

export const addComment = async (req, res, next) => {
     if (validationResult(req).array().length > 0)
          return res.status(400).end();

     try {
          const addCommentQuery =
               "INSERT INTO comments (`desc`, `postId`, `createdAt`, `username`) VALUES (?)";
          const values = [
               req.body.desc,
               req.body.postId,
               moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
               req.username,
          ];
          const result = await query(addCommentQuery, [values]);
          return result.affectedRows === 1 ?
               res.status(204).end() :
               res.status(404).end();
     } catch (error) {
          next(error);
     }
};


export const deleteComment = async (req, res, next) => {
     if (validationResult(req).array().length > 0)
          return res.status(400).end();

     try {
          const deleteCommentQuery = "DELETE FROM comments WHERE  `username` = ? AND `postId` = ?";
          const values = [req.username, req.params.postId];
          const result = await query(deleteCommentQuery, values);
          return result.affectedRows === 1 ?
               res.status(204).end() :
               res.status(404).end();
     } catch (error) {
          next(error);
     }
};
