import db from "../helpers/dbConnection.js";
import util from "util";
import jwt from "jsonwebtoken";

export const getFollower = async (req, res, next) => {
     try {
          const query = util.promisify(db.query).bind(db);
          const getFollowerQuery = `SELECT followerUserId FROM follow WHERE followedUserId = ? `;

          const result = await query(getFollowerQuery, [
               req.query.followedUserId,
          ]);
          return res
               .status(200)
               .json(result.map((follower) => follower.followerUserId));
     } catch (error) {
          next(error);
     }
};

export const follow = async (req, res, next) => {
     try {
          // console.log(req.query,req.body)
          const token = req.cookies.accessToken;
          if (!token) return res.status(401).json("need to log in");

          const verify = util.promisify(jwt.verify).bind(jwt);
          const data = await verify(token, "secretkey");

          const query = util.promisify(db.query).bind(db);
          const followQuery =
               "INSERT INTO follow (`followerUserId`, `followedUserId`) VALUES (?)";
          const values = [data.id, req.body.userId];

          const result = await query(followQuery, [values]);
          return res.status(200).json("following");
     } catch (error) {
          next(error);
     }
};

export const deletefollow = async (req, res, next) => {
     try {
          const token = req.cookies.accessToken;
          if (!token) return res.status(401).json("need to log in");

          const verify = util.promisify(jwt.verify).bind(jwt);
          const data = await verify(token, "secretkey");

          const query = util.promisify(db.query).bind(db);
          const deleteLikeQuery =
               "DELETE FROM follow WHERE `followerUserId` = ? AND `followedUserId` = ?";
          console.log(req.query,req.body)

          const result = await query(deleteLikeQuery, [data.id,req.query.userId]);
          console.log(result)
          return res.status(200).json("unfollow");
     } catch (error) {
          next(error);
     }
};
