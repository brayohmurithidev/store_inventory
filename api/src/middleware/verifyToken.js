import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";

// CHECK IF ELEMENTS EXISTS
const checkRoles = (requiredRoles, userRoles) => {
  console.log(requiredRoles, userRoles);
  return userRoles.some((userRole) => requiredRoles.includes(userRole));
};

const verifyToken = (requiredRoles) => (req, res, next) => {
  const token = req.cookies["token"];
  if (!token) {
    logger.warn(
      {
        url: req.originalUrl,
      },
      "Not Authorized, No token found"
    );
    return res.status(401).json({ msg: "Not Authorized" });
  }
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      logger.warn(
        {
          url: req.originalUrl,
          error: err,
        },
        "Invalid token"
      );
      return res.status(401).json({ msg: "Invalid token" });
    }
    req.user_id = decoded.user_id;
    if (!checkRoles(requiredRoles, JSON.parse(decoded.roles))) {
      logger.warn(
        {
          url: req.originalUrl,
        },
        "Access denied! Logged in user can't access this resource"
      );
      return res.status(403).json({
        msg: "Access denied!",
      });
    }
    next();
  });
};

export { verifyToken };
