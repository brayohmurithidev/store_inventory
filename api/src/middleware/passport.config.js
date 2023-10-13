import passport from "passport";
import localStrategy from "passport-local";
import jwt from "passport-jwt";
import { User } from "../db/models.js";

const jwtStrategy = jwt.Strategy;
const extractJwt = jwt.ExtractJwt;

// LOGIN
// passport.use(
//   new localStrategy(
//     {
//       usernameField: "email",
//       passwordField: "password",
//     },
//     (email, password, cb) => {
//       // DB call
//       return User.findOne({ email, password })
//         .then((user) => {
//           if (!user) {
//             return cb(null, false, { msg: "Incorrectv email/ password" });
//           }
//           return cb(null, user, { msg: "Logged in successfully" });
//         })
//         .catch((err) => cb(err));
//     }
//   )
// );

const opts = {};

opts.jwtFromRequest = extractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY;

passport.use(
  new jwtStrategy(opts, async (payload, done) => {
    try {
      const user = await User.findOne({ where: { user_id: payload.user_id } });

      if (!user) {
        return done(null, false);
      }

      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);

const Roles = {
  admin: 5000,
  store: 2000,
};

const checkIfUserHasAllowedRoles = (allowedRoles, userRoles) => {
  return userRoles.some((role) => allowedRoles.includes(role));
};

export { Roles, checkIfUserHasAllowedRoles };
