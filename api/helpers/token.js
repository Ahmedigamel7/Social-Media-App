import jwt from "jsonwebtoken";
import util from "util";
export const verfiyToken = async (req, res, next) => {
     try {
          const { auth_token } = req.cookies;
          if (!auth_token)
               return res.status(401).json({
                    error: "Unauthorized",
                    message: "Authentication token is missing or invalid.",
               });
          const verfiy = util.promisify(jwt.verify).bind(jwt);
          const data = await verfiy(auth_token, process.env.JWT_SECRET);
          req.userId = data.id;
          next();
     } catch (error) {
          next(error);
     }
};
