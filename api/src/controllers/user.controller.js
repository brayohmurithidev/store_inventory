import { Sequelize } from "sequelize";
import bcrypt from "bcrypt";
import { User } from "../db/models.js";
import { errorLogger } from "../utils/utils.func.js";

// PASSWORD HASH
const hashedPassword = async (password) => {
  try {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  } catch (error) {
    console.error(error);
  }
};

const createUser = async (req, res) => {
  const data = req.body;
  const password = data.password;
  const user_created_by = req?.user_id;
  const hashedPwd = await hashedPassword(password);
  try {
    const user = {
      ...data,
      password: hashedPwd,
      user_created_by: user_created_by,
    };
    await User.create({ ...user });
    res.status(200).json({ msg: "User created successfully" });
  } catch (error) {
    errorLogger(req, error);
    if (error instanceof Sequelize.ValidationError) {
      if (error?.name == "SequelizeUniqueConstraintError") {
        res
          .status(400)
          .json({ msg: `user with email ${data.email} already exists` });
      } else res.status(400).json({ msg: error?.message.split(": ")[1] });
    } else {
      res.status(500).json({ msg: "User creation failed" });
    }
  }
};

// GET ALL USERS
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({ raw: true });
    const newUsers = users.map((obj) => {
      const { password, ...rest } = obj; // Use destructuring to remove the 'password' key
      return rest; // Return the object without the 'password' key
    });
    res.status(200).json(newUsers);
  } catch (error) {
    errorLogger(req, error);
  }
};

// USER PROFILE

const userProfile = async (req, res) => {
  const user_id = req.user_id;
  try {
    const user = await User.findOne({ raw: true, where: { user_id: user_id } });
    console.log(user);
    res.status(200).json(user);
  } catch (error) {
    errorLogger(req, error);
    res.status(500).json({ msg: "An error occurred" });
  }
};

// UPdate logged in user
const updateUserProfile = async (req, res) => {
  const data = req.body;
  const id = req.user_id;
  try {
    if (data === null || Object.keys(data).length === 0) {
      res.status(400).json({ msg: "Fill in missing fields" });
      return;
    }
    const updateUserr = await User.update(
      { ...data },
      { where: { user_id: id } }
    );
    console.log(updateUserr);
    res.status(200).json({ msg: "User updated successfully" });
  } catch (error) {
    errorLogger(req, error);
    res.status(500).json({ msg: "An error occured" });
  }
};

// Get user by id
const getUserById = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findOne({ raw: true, where: { user_id: id } });
    if (!user) {
      res.status(404).json({ msg: "User not found" });
    }
    delete user.password;
    res.status(200).json(user);
  } catch (error) {
    errorLogger(req, error);
    res.status(500).json({ msg: "An error occured" });
  }
};
// update user by id

const updateUser = async (req, res) => {
  const data = req.body;
  const id = req.params.id;
  try {
    if (data === null || Object.keys(data).length === 0) {
      res.status(400).json({ msg: "Fill in missing fields" });
      return;
    }
    const updateUserr = await User.update(
      { ...data },
      { where: { user_id: id } }
    );
    console.log(updateUserr);
    res.status(200).json({ msg: "User updated successfully" });
  } catch (error) {
    errorLogger(req, error);
    res.status(500).json({ msg: "An error occured" });
  }
};

// DELETE USER BY ID
const deleteUserById = async (req, res) => {
  const id = req.params.id;
  const user_id = req.user_id;
  console.log(id, JSON.parse(user_id));
  try {
    if (id == user_id) {
      res
        .status(200)
        .json({ msg: "You cannot delete yourself for security reasons" });
    } else {
      const userToDelete = await User.destroy({ where: { user_id: id } });
      if (!userToDelete) {
        res.status(404).json({ msg: "User not found" });
      }
      res.status(200).json({ msg: "User deleted successfully" });
    }
  } catch (error) {
    errorLogger(req, error);
    res.status(500).json({ msg: "An error occured" });
  }
};

export {
  createUser,
  getUsers,
  userProfile,
  getUserById,
  updateUser,
  updateUserProfile,
  deleteUserById,
};
