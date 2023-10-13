import express from "express";
import {
  createDrug,
  createDrugAllocated,
  createDrugCategory,
  createDrugReceived,
  deleteAllocatedById,
  deleteDrugById,
  deleteDrugCategoryById,
  deleteReceivedById,
  getAllocatedById,
  getDrugById,
  getDrugCategories,
  getDrugCategoryById,
  getDrugs,
  getDrugsInStore,
  getReceivedById,
  getTransactions,
  updateAllocatedById,
  updateDrugById,
  updateDrugCategoryById,
  updateReceivedById,
} from "../controllers/drug.controller.js";

const router = express();

router.route("/categories").post(createDrugCategory).get(getDrugCategories);

router
  .route("/categories/:id")
  .get(getDrugCategoryById)
  .put(updateDrugCategoryById)
  .delete(deleteDrugCategoryById);

router.route("/").post(createDrug).get(getDrugs);
router.route("/inventory-status").get(getDrugsInStore);
router.route("/received").post(createDrugReceived);
router.route("/allocated").post(createDrugAllocated);
router.route("/transactions").post(getTransactions);
router
  .route("/received/:id")
  .get(getReceivedById)
  .put(updateReceivedById)
  .delete(deleteReceivedById);
router
  .route("/allocated/:id")
  .get(getAllocatedById)
  .put(updateAllocatedById)
  .delete(deleteAllocatedById);
router
  .route("/:id")
  .get(getDrugById)
  .put(updateDrugById)
  .delete(deleteDrugById);

export default router;
