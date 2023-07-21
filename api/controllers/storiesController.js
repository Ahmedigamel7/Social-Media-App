import util from 'util';
import db from '../helpers/dbConnection.js'
import { validationResult } from 'express-validator';
import moment from 'moment';
const query = util.promisify(db.query).bind(db);

export const getStory = async (req, res, next) => {
    try {
        const username = req.query.username;
        if (username != 'undefined' && username?.length < 6 || username?.length > 15)
            return res.status(400).end();

        const q = (username != 'undefined') ? `SELECT s.id, s.img, s.createdAt AS 'img-date', s.username, u.name, u.profilePic, u.coverPic, u.createdAt AS 'account-date' 
        FROM stories AS s JOIN users AS u ON (s.username = u.username) WHERE u.username = ?` :
            `SELECT u.name, u.username, u.profilePic, u.createdAt AS 'account-date', s.id, s.img, s.createdAt AS 'img-date' FROM users AS u JOIN stories AS s
             ON (u.username=s.username) LEFT JOIN  relationships  AS r 
             ON(s.username=r.followedUsername) WHERE s.username = ? OR r.followerUsername = ?`
            ;
        const values = username != 'undefined' ? [username] : [req.username, req.username];

        const stories = await query(q, values);
        res.status(200).json(stories);
    } catch (error) {
        next(error)
    }
}

export const addStory = async (req, res, next) => {
    if (validationResult(req).array().length > 0)
        return res.status(400).end();

    try {
        const addStoryQuery =
            "INSERT INTO stories (`img`, `username`, `createdAt`) VALUES (?)";
        const values = [
            req.body.img,
            req.username,
            moment(Date.now()).local(true).format("YYYY-MM-DD HH:mm:ss"),
        ];
        const result = await query(addStoryQuery, [values]);
        return result.affectedRows > 0
            ? res.status(201).end()
            : res.status(404).end();
    } catch (error) {
        next(error);
    }
};

export const deleteStory = async (req, res, next) => {
    if (validationResult(req).array().length > 0)
        return res.status(400).end();

    try {
        const q = 'DELETE FROM stories WHERE id = ?';
        const result = await query(q, [req.params.storyId]);
        return result.affectedRows > 0
            ? res.status(204).end()
            : res.status(404).end();

    } catch (error) {
        next(error)
    }
}
