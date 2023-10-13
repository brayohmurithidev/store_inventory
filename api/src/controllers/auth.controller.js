import { User } from "../db/models.js";
import { Sequelize } from "sequelize";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { errorLogger } from "../utils/utils.func.js";

// confirm hash
const passwordMatch = async (password, dbPassword) => {
  try {
    const result = await bcrypt.compare(password, dbPassword);
    return result;
  } catch (error) {
    errorLogger(req, error);
  }
};

// GENERATE JWT
const generateJWT = async (userData) => {
  const today = new Date();
  const expDate = new Date(today);
  expDate.setDate(today.getDate() + 60);

  return jwt.sign(
    { ...userData, exp: parseInt(expDate.getTime() / 1000, 10) },
    process.env.SECRET_KEY
  );
};

// LOGIN

const login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({ raw: true, where: { email: email } });
    if (!user) {
      res.status(401).json({ msg: "Wrong Email/ Password" });
    } else {
      const dbPassword = user.password;
      if (!passwordMatch(password, dbPassword)) {
        res.status(401).json({ msg: "Wrong Email/ Password" });
      } else {
        const last_login = new Date(Date.now());
        await User.update(
          { last_login: last_login },
          { where: { email: email } }
        );
        const userData = {
          email: user.email,
          user_id: user.user_id,
          roles: user.role,
        };
        const token = await generateJWT(userData);
        res.cookie("token", token, { httpOnly: true });
        res
          .status(401)
          .json({ ...userData, last_login: last_login, token: token });
      }
    }
  } catch (error) {
    errorLogger(req, error);
  }
};

// LOGOUT
const logout = async (req, res) => {
  res.cookie("token", "", { httpOnly: true });
  res.status(200).json({ msg: "Logged out successfully" });
};

// PASSWORD RESET REQUEST
// PASSWORD RESET

export { login, logout };
