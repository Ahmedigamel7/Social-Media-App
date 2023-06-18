import db from "../helpers/dbConnection.js";
import util from "util";
import jwt from "jsonwebtoken";

export const getUser = async (req, res, next) => {
     try {
          const query = util.promisify(db.query).bind(db);
          const getUserQuery = `SELECT * FROM users WHERE id = ?`;

          const result = await query(getUserQuery, [req.params.userId]);
          const { password, ...info } = result[0];
          // console.log(info)
          return res.status(200).json(info);
     } catch (error) {
          next(error);
     }
};

export const updateUser = async (req, res, next) => {
     try {
          const token = req.cookies.accessToken;
          if (!token) return res.status(401).json("need to log in");
console.log(req.body)
          const verify = util.promisify(jwt.verify).bind(jwt);
          const data = await verify(token, "secretkey");

          const query = util.promisify(db.query).bind(db);
          const updateUserQuery =
               "UPDATE users SET `name`=?, `city`=?, `website`=? `profilePic`=?, `coverPic`=?  WHERE id = ?";

          const values = [
               req.body.name,
               req.body.city,
               req.body.website,
               req.body.profilePic,
               req.body.coverPic,
          ];
          const result = await query(updateUserQuery, [values]);
          return result.affectedRows > 0
               ? res.status(200).json("updated successfully")
               : res.status(403).json("not allowed");
     } catch (error) {
          next(error);
     }
};
