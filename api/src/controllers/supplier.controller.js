import { Supplier, DrugReceived } from "../db/models.js";
import { checkIfAllKeysAreValid, errorLogger } from "../utils/utils.func.js";
// POST /api/suppliers
const createSupplier = async (req, res) => {
  const data = req.body;
  try {
    const createdUser = await Supplier.create({ ...data }, { raw: true });
    res.status(200).json({
      msg: `Supplier ${createdUser.supplier_name} created successfully`,
    });
  } catch (error) {
    errorLogger(req, error);
    res.status(500).json({ msg: "An error occured" });
  }
};
// GET /api/suppliers
const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.findAll({ raw: true });
    if (!suppliers || suppliers.length === 0) {
      res.status(404).json({ msg: "No supplier found" });
    }
    res.status(200).json(suppliers);
  } catch (error) {
    errorLogger(req, error);
    res.status(500).json({ msg: "An error occured" });
  }
};
// GET /api/suppliers/:id
const getSupplierById = async (req, res) => {
  const id = req.params.id;
  try {
    const supplier = await Supplier.findOne({
      where: { supplier_id: id },
      raw: true,
    });
    if (!supplier) {
      res.status(404).json({ msg: "No supplier record found" });
    } else {
      res.status(200).json(supplier);
    }
  } catch (error) {
    errorLogger(req, error);
    res.status(500).json({ msg: "An error occured" });
  }
};
// PUT /api/suppliers/:id
const updateSupplierById = async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  try {
    if (data === null || Object.keys(data).length === 0) {
      res.status(400).json({ msg: "Fill in missing fields" });
      return;
    }

    const supplier = await Supplier.findOne({
      where: { supplier_id: id },
    });
    if (!supplier) {
      res.status(400).json({ msg: "Supplier Not Found" });
    } else {
      if (!checkIfAllKeysAreValid(data, Supplier)) {
        errorLogger(req, "Incoming data no matching db fields");
        return res.status(404).json({ msg: "Invalid attributes keys" });
      }
      await supplier.update({ ...data });
      // await category.save();
      res.status(200).json({ msg: "Supplier updated successfully" });
    }
  } catch (error) {
    errorLogger(req, error);
    res.status(500).json({ msg: "An error occured" });
  }
};
//DELETE /api/suppliers/:id
const deleteSupplierById = async (req, res) => {
  const id = req.params.id;
  console.log(id, JSON.parse(user_id));
  try {
    const supplierToDelete = await Supplier.destroy({
      where: { supplier_id: id },
    });
    if (!supplierToDelete) {
      res.status(404).json({ msg: "Supplier record not found" });
    }
    res.status(200).json({ msg: "Supplier record deleted successfully" });
  } catch (error) {
    errorLogger(req, error);
    res.status(500).json({ msg: "An error occured" });
  }
};
// GET /api/suppliers/:id/inventory
// const supplierDrugList = async (req, res) => {
//   con
// };
// GET /api/suppliers/:id/transactions
// GET /api/suppliers/search

export {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplierById,
  deleteSupplierById,
};
