import {
  DrugReceived,
  DrugInStore,
  DrugReleased,
  Drug,
  DrugCategory,
} from "../db/models.js";
import sequelize from "../db/db.config.js";
import {
  allKeysAndValues,
  checkIfAllKeysAreValid,
  errorLogger,
  handleMySQLError,
} from "../utils/utils.func.js";

// DRUGCATEGORY
// POST /api/drugs/categories
const createDrugCategory = async (req, res) => {
  const data = req.body;
  const requiredKeys = ["category_name", "description"];
  try {
    if (!allKeysAndValues(requiredKeys, { ...data })) {
      res.status(400).json({ msg: "Fill in all fields" });
    } else {
      if (!checkIfAllKeysAreValid(data, DrugCategory)) {
        errorLogger(req, "Incoming data no matching db fields");
        return res.status(404).json({ msg: "Invalid attributes keys" });
      }
      await DrugCategory.create({ ...data });
      res.status(200).json({ msg: "Category created successfully" });
    }
  } catch (error) {
    errorLogger(req, error);
    if (error?.name) {
      if (error?.parent?.code) {
        res.status(400).json({ msg: handleMySQLError(error?.parent?.code) });
      } else {
        res.status(400).json({ msg: `Database error ` });
      }
    } else {
      res.status(500).json({ msg: "Ann error occurred" });
    }
  }
};
// GET /api/drugs/categories
const getDrugCategories = async (req, res) => {
  try {
    const categories = await DrugCategory.findAll({ raw: true });
    res.status(200).json(categories);
  } catch (error) {
    errorLogger(req, error);
    if (error?.name) {
      if (error?.parent?.code) {
        res.status(400).json({ msg: handleMySQLError(error?.parent?.code) });
      } else {
        res.status(400).json({ msg: `Database error ` });
      }
    } else {
      res.status(500).json({ msg: "Ann error occurred" });
    }
  }
};
// GET /api/drugs/categories/:id
const getDrugCategoryById = async (req, res) => {
  const id = req.params.id;
  try {
    const category = await DrugCategory.findOne({
      raw: true,
      where: {
        category_id: id,
      },
    });
    if (!category) {
      res.status(404).json({ msg: "No category record found" });
    } else {
      res.status(200).json(category);
    }
  } catch (error) {
    errorLogger(req, error);
    if (error?.name) {
      if (error?.parent?.code) {
        res.status(400).json({ msg: handleMySQLError(error?.parent?.code) });
      } else {
        res.status(400).json({ msg: `Database error ` });
      }
    } else {
      res.status(500).json({ msg: "Ann error occurred" });
    }
  }
};
// PUT /api/drugs/categories/:id
const updateDrugCategoryById = async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  try {
    if (data === null || Object.keys(data).length === 0) {
      res.status(400).json({ msg: "Fill in missing fields" });
      return;
    }

    const category = await DrugCategory.findOne({
      where: { category_id: id },
    });
    if (!category) {
      res.status(400).json({ msg: "Category Not Found" });
    } else {
      if (!checkIfAllKeysAreValid(data, DrugCategory)) {
        errorLogger(req, "Incoming data no matching db fields");
        return res.status(404).json({ msg: "Invalid attributes keys" });
      }
      await category.update({ ...data });
      // await category.save();
      res.status(200).json({ msg: "Category updated successfully" });
    }
  } catch (error) {
    errorLogger(req, error);
    if (error?.name) {
      if (error?.parent?.code) {
        res.status(400).json({ msg: handleMySQLError(error?.parent?.code) });
      } else {
        res.status(400).json({ msg: `Database error ` });
      }
    } else {
      res.status(500).json({ msg: "Ann error occurred" });
    }
  }
};
// DELETE /api/drugs/categories/:id
const deleteDrugCategoryById = async (req, res) => {
  const id = req.params.id;

  try {
    const drugCategoryToDelete = await DrugCategory.destroy({
      where: { category_id: id },
    });
    if (!drugCategoryToDelete) {
      res.status(404).json({ msg: "Category record not found" });
    } else {
      res.status(200).json({ msg: "Category record deleted successfully" });
    }
  } catch (error) {
    errorLogger(req, error);
    if (error?.name) {
      if (error?.parent?.code) {
        res.status(400).json({ msg: handleMySQLError(error?.parent?.code) });
      } else {
        res.status(400).json({ msg: `Database error ` });
      }
    } else {
      res.status(500).json({ msg: "Ann error occurred" });
    }
  }
};

// Drug Creation and Management (drugs table)
// POST /api/drugs
const createDrug = async (req, res) => {
  try {
    const data = req.body;
    const requiredKeys = ["drug_name", "category"];

    if (!allKeysAndValues(requiredKeys, { ...data })) {
      return res.status(400).json({ msg: "Fill in all fields" });
    }

    if (!checkIfAllKeysAreValid(data, Drug)) {
      errorLogger(req, "Incoming data no matching db fields");
      return res.status(404).json({ msg: "Invalid attributes keys" });
    }
    await Drug.create({ ...data });
    return res.status(202).json({ msg: "Drug created successfully" });
  } catch (error) {
    errorLogger(req, error);
    if (error?.name) {
      if (error?.parent?.code) {
        res.status(400).json({ msg: handleMySQLError(error?.parent?.code) });
      } else {
        res.status(400).json({ msg: `Database error ` });
      }
    } else {
      res.status(500).json({ msg: "Ann error occurred" });
    }
  }
};
// GET /api/drugs
const getDrugs = async (req, res) => {
  try {
    const drugs = await Drug.findAll({ raw: true });
    if (drugs.length < 1) {
      return res.status(404).json({ msg: "No drug found" });
    }
    return res.status(200).json(drugs);
  } catch (error) {
    errorLogger(req, error);
    if (error?.name) {
      if (error?.parent?.code) {
        res.status(400).json({ msg: handleMySQLError(error?.parent?.code) });
      } else {
        res.status(400).json({ msg: `Database error ` });
      }
    } else {
      res.status(500).json({ msg: "Ann error occurred" });
    }
  }
};
// GET /api/drugs/:id
const getDrugById = async (req, res) => {
  try {
    const id = req.params.id;
    const drug = await Drug.findOne({
      raw: true,
      where: {
        drug_id: id,
      },
    });
    if (!drug) {
      res.status(404).json({ msg: "No drug record found" });
    } else {
      res.status(200).json(drug);
    }
  } catch (error) {
    errorLogger(req, error);
    if (error?.name) {
      if (error?.parent?.code) {
        res.status(400).json({ msg: handleMySQLError(error?.parent?.code) });
      } else {
        res.status(400).json({ msg: `Database error ` });
      }
    } else {
      res.status(500).json({ msg: "Ann error occurred" });
    }
  }
};
// PUT /api/drugs/:id
const updateDrugById = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    if (data === null || Object.keys(data).length === 0) {
      res.status(400).json({ msg: "Fill in missing fields" });
      return;
    }

    const drug = await Drug.findOne({
      where: { drug_id: id },
    });
    if (!drug) {
      res.status(400).json({ msg: "Drug Not Found" });
    } else {
      if (!checkIfAllKeysAreValid(data, Drug)) {
        errorLogger(req, "Incoming data no matching db fields");
        return res.status(404).json({ msg: "Invalid attributes keys" });
      }
      await drug.update({ ...data });
      // await category.save();
      res.status(200).json({ msg: "Category updated successfully" });
    }
  } catch (error) {
    console.log(error);
    errorLogger(req, error);
    if (error?.name) {
      if (error?.parent?.code) {
        res.status(400).json({ msg: handleMySQLError(error?.parent?.code) });
      } else {
        res.status(400).json({ msg: `Database error ` });
      }
    } else {
      res.status(500).json({ msg: "Ann error occurred" });
    }
  }
};
// DELETE /api/drugs/:id
const deleteDrugById = async (req, res) => {
  try {
    const id = req.params.id;
    const drugToDelete = await Drug.destroy({
      where: { drug_id: id },
    });
    if (!drugToDelete) {
      res.status(404).json({ msg: "Drug record not found" });
    } else {
      res.status(200).json({ msg: "Drug record deleted successfully" });
    }
  } catch (error) {
    errorLogger(req, error);
    if (error?.name) {
      if (error?.parent?.code) {
        res.status(400).json({ msg: handleMySQLError(error?.parent?.code) });
      } else {
        res.status(400).json({ msg: `Database error ` });
      }
    } else {
      res.status(500).json({ msg: "Ann error occurred" });
    }
  }
};

// Drug Inventory Status (drugsInStore table)
// GET /api/drugs/inventory-status
const getDrugsInStore = async (req, res) => {
  try {
    const drugs = await DrugInStore.findAll({
      raw: true,
      where: { isAvailable: true },
    });
    console.log(drugs);
    if (drugs.length < 1) {
      return res.status(404).json({ msg: "No available drugs available" });
    }
    return res.status(200).json(drugs);
  } catch (error) {
    errorLogger(req, error);
    if (error?.name) {
      if (error?.parent?.code) {
        res.status(400).json({ msg: handleMySQLError(error?.parent?.code) });
      } else {
        res.status(400).json({ msg: `Database error ` });
      }
    } else {
      res.status(500).json({ msg: "Ann error occurred" });
    }
  }
};

// Drug Transactions (drugsReceived and drugsReleased tables):
// POST /api/drugs/received
const createDrugReceived = async (req, res) => {
  try {
    const data = req.body;
    const requiredKeys = [
      "drug_id",
      "quantity_received",
      "quantity_measure",
      "release_level",
      "expiry_date",
      "buying_price",
      "supplier",
      "received_by",
    ];
    if (!allKeysAndValues(requiredKeys, { ...data })) {
      return res.status(400).json({ msg: "Fill in all fields" });
    }

    if (!checkIfAllKeysAreValid(data, DrugReceived)) {
      errorLogger(req, "Incoming data no matching db fields");
      return res.status(404).json({ msg: "Invalid attributes keys" });
    }
    const inserted = await DrugReceived.create({ ...data });
    const drugId = inserted.drug_id;
    const transactionId = inserted.transaction_id;
    const quantityReceived = inserted.quantity_received;
    sequelize.query(
      "CALL AddOrUpdateDrugInStore(:drugId, :transactionId, :quantityReceived)",
      {
        replacements: { drugId, transactionId, quantityReceived },
      }
    );
    return res.status(200).json({ msg: "New drug added to store" });
  } catch (error) {
    errorLogger(req, error);
    if (error?.name) {
      if (error?.parent?.code) {
        res.status(400).json({ msg: handleMySQLError(error?.parent?.code) });
      } else {
        res.status(400).json({ msg: `Database error ` });
      }
    } else {
      res.status(500).json({ msg: "Ann error occurred" });
    }
  }
};
// POST /api/drugs/allocated
const createDrugAllocated = async (req, res) => {
  try {
    const data = req.body;
    const requiredKeys = [
      "store_drug_id",
      "quantity_released",
      "destination",
      "released_by",
      "person_released_to",
    ];
    if (!allKeysAndValues(requiredKeys, { ...data })) {
      return res.status(400).json({ msg: "Fill in all fields" });
    }

    if (!checkIfAllKeysAreValid(data, DrugReleased)) {
      errorLogger(req, "Incoming data no matching db fields");
      return res.status(404).json({ msg: "Invalid attributes keys" });
    }
    await DrugReleased.create({ ...data });
    return res.status(200).json({ msg: "Drug realocated" });
  } catch (error) {
    errorLogger(req, error);
    if (error?.name) {
      if (error?.parent?.code) {
        res.status(400).json({ msg: handleMySQLError(error?.parent?.code) });
      } else {
        res.status(400).json({ msg: `Database error ` });
      }
    } else {
      res.status(500).json({ msg: "Ann error occurred" });
    }
  }
};
// GET /api/drugs/transactions
const getTransactions = async (req, res) => {
  try {
    const allocated = await DrugReleased.findAll({ raw: true });
    const received = await DrugReceived.findAll({ raw: true });
    if (allocated.length < 1 && received.length < 1) {
      return res.status(404).json({ msg: "No transactions yet" });
    }
    return res.status(200).json({ received: received, allocated: allocated });
  } catch (error) {
    errorLogger(req, error);
    if (error?.name) {
      if (error?.parent?.code) {
        res.status(400).json({ msg: handleMySQLError(error?.parent?.code) });
      } else {
        res.status(400).json({ msg: `Database error ` });
      }
    } else {
      res.status(500).json({ msg: "Ann error occurred" });
    }
  }
};
// GET /api/drugs/received/:id
const getReceivedById = async (req, res) => {
  try {
    const id = req.params.id;
    const received = await DrugReceived.findOne({
      raw: true,
      where: {
        transaction_id: id,
      },
    });
    if (!received) {
      res.status(404).json({ msg: "No received transaction record found" });
    } else {
      res.status(200).json(received);
    }
  } catch (error) {
    errorLogger(req, error);
    if (error?.name) {
      if (error?.parent?.code) {
        res.status(400).json({ msg: handleMySQLError(error?.parent?.code) });
      } else {
        res.status(400).json({ msg: `Database error ` });
      }
    } else {
      res.status(500).json({ msg: "Ann error occurred" });
    }
  }
};
// GET /api/drugs/allocated/:id
const getAllocatedById = async (req, res) => {
  try {
    const id = req.params.id;
    const allocated = await DrugReleased.findOne({
      raw: true,
      where: {
        transaction_id: id,
      },
    });
    if (!allocated) {
      res.status(404).json({ msg: "No allocated transaction record found" });
    } else {
      res.status(200).json(allocated);
    }
  } catch (error) {
    errorLogger(req, error);
    if (error?.name) {
      if (error?.parent?.code) {
        res.status(400).json({ msg: handleMySQLError(error?.parent?.code) });
      } else {
        res.status(400).json({ msg: `Database error ` });
      }
    } else {
      res.status(500).json({ msg: "Ann error occurred" });
    }
  }
};
// PUT /api/drugs/received/:id
const updateReceivedById = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    if (data === null || Object.keys(data).length === 0) {
      res.status(400).json({ msg: "Fill in missing fields" });
      return;
    }

    const received = await DrugReceived.findOne({
      where: { transaction_id: id },
    });
    if (!received) {
      res.status(400).json({ msg: "Transaction Not Found" });
    } else {
      if (!checkIfAllKeysAreValid(data, DrugReceived)) {
        errorLogger(req, "Incoming data no matching db fields");
        return res.status(404).json({ msg: "Invalid attributes keys" });
      }
      await received.update({ ...data });
      // await category.save();
      res.status(200).json({ msg: "Transaction updated successfully" });
    }
  } catch (error) {
    console.log(error);
    errorLogger(req, error);
    if (error?.name) {
      if (error?.parent?.code) {
        res.status(400).json({ msg: handleMySQLError(error?.parent?.code) });
      } else {
        res.status(400).json({ msg: `Database error ` });
      }
    } else {
      res.status(500).json({ msg: "Ann error occurred" });
    }
  }
};
// PUT /api/drugs/allocated/:id
const updateAllocatedById = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    if (data === null || Object.keys(data).length === 0) {
      res.status(400).json({ msg: "Fill in missing fields" });
      return;
    }

    const allocated = await DrugReleased.findOne({
      where: { transaction_id: id },
    });
    if (!allocated) {
      res.status(400).json({ msg: "Transaction Not Found" });
    } else {
      if (!checkIfAllKeysAreValid(data, DrugReleased)) {
        errorLogger(req, "Incoming data no matching db fields");
        return res.status(404).json({ msg: "Invalid attributes keys" });
      }
      await allocated.update({ ...data });
      // await category.save();
      res.status(200).json({ msg: "Transaction updated successfully" });
    }
  } catch (error) {
    console.log(error);
    errorLogger(req, error);
    if (error?.name) {
      if (error?.parent?.code) {
        res.status(400).json({ msg: handleMySQLError(error?.parent?.code) });
      } else {
        res.status(400).json({ msg: `Database error ` });
      }
    } else {
      res.status(500).json({ msg: "Ann error occurred" });
    }
  }
};
// DELETE /api/drugs/received/:id
const deleteReceivedById = async (req, res) => {
  try {
    const id = req.params.id;
    const receivedToDelete = await DrugReceived.destroy({
      where: { transaction_id: id },
    });
    if (!receivedToDelete) {
      res.status(404).json({ msg: "Transaction record not found" });
    } else {
      res.status(200).json({ msg: "Transaction record deleted successfully" });
    }
  } catch (error) {
    errorLogger(req, error);
    if (error?.name) {
      if (error?.parent?.code) {
        res.status(400).json({ msg: handleMySQLError(error?.parent?.code) });
      } else {
        res.status(400).json({ msg: `Database error ` });
      }
    } else {
      res.status(500).json({ msg: "Ann error occurred" });
    }
  }
};
// DELETE /api/drugs/allocated/:id
const deleteAllocatedById = async (req, res) => {
  try {
    const id = req.params.id;
    const allocatedToDelete = await DrugReleased.destroy({
      where: { transaction_id: id },
    });
    if (!allocatedToDelete) {
      res.status(404).json({ msg: "Transaction record not found" });
    } else {
      res.status(200).json({ msg: "Transaction record deleted successfully" });
    }
  } catch (error) {
    errorLogger(req, error);
    if (error?.name) {
      if (error?.parent?.code) {
        res.status(400).json({ msg: handleMySQLError(error?.parent?.code) });
      } else {
        res.status(400).json({ msg: `Database error ` });
      }
    } else {
      res.status(500).json({ msg: "Ann error occurred" });
    }
  }
};

export {
  createDrugCategory,
  getDrugCategories,
  getDrugCategoryById,
  updateDrugCategoryById,
  deleteDrugCategoryById,
  createDrug,
  getDrugs,
  getDrugById,
  updateDrugById,
  deleteDrugById,
  getDrugsInStore,
  createDrugAllocated,
  createDrugReceived,
  getTransactions,
  getReceivedById,
  getAllocatedById,
  updateAllocatedById,
  updateReceivedById,
  deleteAllocatedById,
  deleteReceivedById,
};
