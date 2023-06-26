
import db from "../helpers/dbConnection.js";
import util from "util";
import { validationResult } from "express-validator";

const query = util.promisify(db.query).bind(db);

export const getFollowers = async (req, res, next) => {
     if (validationResult(req).array().length > 0)
          return res.status(400).end();

     try {
          const followedUsername = req.query.followedUsername;
          const getFollowerQuery = `SELECT followerUsername FROM relationships WHERE followedUsername = ? `;

          const result = await query(getFollowerQuery, [
               followedUsername,
          ]);
          const followerUsers = result.map((follower) => follower.followerUsername)
          res
               .status(200)
               .json(followerUsers);
     } catch (error) {
          next(error);
     }
};

export const follow = async (req, res, next) => {
     if (validationResult(req).array().length > 0)
          return res.status(400).end();

     try {
          const followedUsername = req.body.followedUsername;
          const followQuery =
               "INSERT INTO relationships (`followerUsername`, `followedUsername`) VALUES (?)";
          const values = [req.username, followedUsername];

          const result = await query(followQuery, [values]);
          return result.affectedRows > 0
               ? res.status(201).end()
               : res.status(404).end();
     } catch (error) {
          next(error);
     }
};

export const unfollow = async (req, res, next) => {
     if (validationResult(req).array().length > 0)
          return res.status(400).end();

     try {
          const followedUsername = req.params.followedUsername;
          const deleteLikeQuery =
               "DELETE FROM relationships WHERE `followerUsername` = ? AND `followedUsername` = ?";
          const result = await query(deleteLikeQuery, [req.username, followedUsername]);

          return result.affectedRows > 0
               ? res.status(204).end()
               : res.status(404).end();
     } catch (error) {
          next(error);
     }
};
