import { validationResult } from "express-validator";
import db from "../helpers/dbConnection.js";
import util from "util";

const query = util.promisify(db.query).bind(db);

export const getUser = async (req, res, next) => {
     const error = validationResult(req).array();

     if (error.length > 0)
          return res.status(400).end();

     try {
          const getUserQuery = `SELECT * FROM users WHERE username = ?`;
          const result = await query(getUserQuery, [req.query.username]);

          if (result.length === 0) {
               return res.status(404).json({
                    error: {
                         code: "404",
                         msg: "User not found."
                    }
               })
          }

          const { password, id, email, ...info } = result[0];

          return res.status(200).json(info);
     } catch (error) {
          next(error);
     }
};

export const updateUser = async (req, res, next) => {

     const errors = validationResult(req).array();
     if (errors.length > 0) {
          const { path, msg } = errors[0];
          const error = { path, msg };
          return res.status(422).json(error);
     }

     try {

          const updateUserQuery =
               "UPDATE users SET `name`=?, `city`=?, `website`=? `profilePic`=?, `coverPic`=?  WHERE username = ?";

          const values = [
               req.body.name,
               req.body.city,
               req.body.website,
               req.body.profilePic,
               req.body.coverPic,
               req.query.username
          ];
          const result = await query(updateUserQuery, [values]);
          return result.affectedRows > 0
               ? res.status(200).json("updated successfully.")
               : res.status(404).json("No data updated.");
     } catch (error) {
          next(error);
     }
};
