import util from 'util';
import db from '../helpers/dbConnection.js'
import { validationResult } from 'express-validator';
import moment from 'moment';
const query = util.promisify(db.query).bind(db);

export const getStory = async (req, res, next) => {
    if (validationResult(req).array().length > 0)
        return res.status(400).end();

    try {
        const q = 'SELECT * FROM stories WHERE username = ?';
        const stories = await query(q, [req.query.username]);
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
