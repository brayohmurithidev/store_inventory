import express from "express";
import {
  createSupplier,
  deleteSupplierById,
  getSupplierById,
  getSuppliers,
  updateSupplierById,
} from "../controllers/supplier.controller.js";

const router = express();

router.route("/").get(getSuppliers).post(createSupplier);
router
  .route("/:id")
  .get(getSupplierById)
  .put(updateSupplierById)
  .delete(deleteSupplierById);

export default router;
