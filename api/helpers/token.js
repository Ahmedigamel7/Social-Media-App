import jwt from "jsonwebtoken";
import util from "util";
export const verfiyToken = async (req, res, next) => {
    try {
        const { auth_token } = req.cookies;
        if (!auth_token) {
            const error = { status: 401, msg: "Authentication token is missing" }
            return res.status(401).json(error);
        }

        const verfiy = util.promisify(jwt.verify).bind(jwt);
        const data = await verfiy(auth_token, process.env.JWT_SECRET);
        req.username = data.username;

        next();
    } catch (error) {
        next(error);
    }
};
