import express from "express";
import {
  createUser,
  deleteUserById,
  getUserById,
  getUsers,
  updateUser,
  updateUserProfile,
  userProfile,
} from "../controllers/user.controller.js";
import Roles from "../utils/Roles.js";
import { verifyToken } from "../middleware/verifyToken.js";
const router = express.Router();

router.post("/user", verifyToken([Roles.admin]), createUser);
router.get(
  "/users",
  //   passport.authenticate("jwt", { session: false }),
  verifyToken([Roles.admin]),
  getUsers
);

// USER PROFILE
router
  .route("/user")
  .get(verifyToken(Object.values(Roles)), userProfile)
  .put(verifyToken(Object.values(Roles)), updateUserProfile);

// ADMIN USER MGT
// Get, update, delete user by id By admin
router
  .route("/user/:id")
  .get(verifyToken([Roles.admin]), getUserById)
  .put(verifyToken([Roles.admin]), updateUser)
  .delete(verifyToken([Roles.admin]), deleteUserById);

export default router;
