import { DataTypes } from "sequelize";
import sequelize from "./db.config.js";
import bcrypt from "bcrypt";

// PASSWORD HASH
const hashedPassword = async () => {
  try {
    const hash = await bcrypt.hash("1234", 10);
    return hash;
  } catch (error) {
    console.error(error);
  }
};

// Define the users model
const User = sequelize.define(
  "tblUser",
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        endsWithVHC: function (value) {
          if (!value.endsWith("@villagehopecore.org")) {
            throw new Error("User email must be a valid organization email");
          }
        },
      },
    },
    role: {
      type: DataTypes.JSON,
      defaultValue: [2000],
    },
    password: {
      type: DataTypes.STRING,
    },
    last_login: {
      type: DataTypes.DATE,
    },
    last_password_change: {
      type: DataTypes.DATE,
    },
    user_created_by: {
      type: DataTypes.INTEGER,
    },
  },
  { freezeTableName: true }
);

const Supplier = sequelize.define(
  "tblSupplier",
  {
    supplier_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    supplier_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contact_name: {
      type: DataTypes.STRING,
    },
    contact_email: {
      type: DataTypes.STRING,
      unique: true,
    },
    contact_phone: {
      type: DataTypes.STRING,
      unique: true,
    },
    supplier_location: {
      type: DataTypes.STRING,
    },
    additional_information: {
      type: DataTypes.TEXT,
    },
  },
  { freezeTableName: true }
);

const DrugCategory = sequelize.define(
  "tblDrugCategory",
  {
    category_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    category_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
  },
  { freezeTableName: true }
);

const Notification = sequelize.define(
  "tblNotifications",
  {
    notification_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    item_id: {
      type: DataTypes.INTEGER,
    },
    threshold_quantity: {
      type: DataTypes.INTEGER,
    },
    additional_information: {
      type: DataTypes.TEXT,
    },
    notification_sent: {
      type: DataTypes.BOOLEAN,
    },
    sent_to: {
      type: DataTypes.INTEGER,
    },
  },
  { freezeTableName: true }
);

const Drug = sequelize.define(
  "tblDrugs",
  {
    drug_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    drug_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.INTEGER,
      references: {
        model: "tblDrugCategory",
        key: "category_id",
      },
    },
    drug_initials: {
      type: DataTypes.STRING(20),
    },
  },
  { freezeTableName: true }
);

const DrugReceived = sequelize.define(
  "tblDrugReceived",
  {
    transaction_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    drug_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "tblDrugs",
        key: "drug_id",
      },
    },
    quantity_received: {
      type: DataTypes.INTEGER,
    },
    quantity_measure: {
      type: DataTypes.STRING,
    },
    release_level: {
      type: DataTypes.ENUM,
      values: ["high", "medium", "low"],
    },
    expiry_date: { type: DataTypes.DATEONLY },
    buying_price: { type: DataTypes.INTEGER },
    supplier: {
      type: DataTypes.INTEGER,
      references: {
        model: "tblSupplier",
        key: "supplier_id",
      },
    },
    received_by: {
      type: DataTypes.INTEGER,
      references: { model: "tblUser", key: "user_id" },
    },
  },
  { freezeTableName: true }
);

const DrugInStore = sequelize.define(
  "tblDrugInStore",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    // drug_id: { type: DataTypes.INTEGER },
    drug_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "tblDrugs",
        key: "drug_id",
      },
    },
    transaction_id: { type: DataTypes.JSON }, //ARRAY OF TRANSACTIONS
    opening_quantity: { type: DataTypes.INTEGER },
    threshold_limit: { type: DataTypes.INTEGER },
    remaining_quantity: { type: DataTypes.INTEGER },
    isAvailable: { type: DataTypes.BOOLEAN },
  },
  { freezeTableName: true }
);

const DrugReleased = sequelize.define(
  "tblDrugReleased",
  {
    transaction_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    store_drug_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "tblDrugInStore",
        key: "id",
      },
    },
    quantity_released: { type: DataTypes.INTEGER },
    destination: { type: DataTypes.STRING },
    released_by: { type: DataTypes.INTEGER },
    person_released_to: { type: DataTypes.JSON }, // should be an array of objects {name: "", "date": ""}
  },
  { freezeTableName: true }
);

DrugReceived.belongsTo(User, {
  foreignKey: "received_by",
  as: "receivedByUser", // You can choose a suitable alias
});
DrugReleased.belongsTo(User, {
  foreignKey: "released_by",
  as: "releasedByUser", // You can choose a suitable alias
});
DrugReceived.belongsTo(Supplier, {
  foreignKey: "supplier",
  as: "receivedFromSupplier", // You can choose a suitable alias
});
DrugReceived.belongsTo(Drug, {
  foreignKey: "drug_id",
  as: "receivedDrug", // You can choose a suitable alias
});
DrugReleased.belongsTo(DrugInStore, {
  foreignKey: "store_drug_id",
  as: "releasedDrugInStore", // You can choose a suitable alias
});
DrugInStore.belongsTo(Drug, {
  foreignKey: "drug_id",
  as: "storedDrug", // You can choose a suitable alias
});

sequelize.query(`
  CREATE PROCEDURE IF NOT EXISTS AddOrUpdateDrugInStore(
      IN p_drug_id INT,
      IN p_quantity_received INT
  )
  BEGIN
      DECLARE v_existing_record INT;

      -- Check if a record for the drug already exists
      SELECT id INTO v_existing_record FROM tblDrugInStore WHERE drug_id = p_drug_id LIMIT 1;

      IF v_existing_record IS NOT NULL THEN
          -- Drug exists in store, increment remaining quantity and add the transaction ID
          UPDATE tblDrugInStore
          SET remaining_quantity = remaining_quantity + p_quantity_received,
              transaction_id = JSON_ARRAY_APPEND(transaction_id, '$', LAST_INSERT_ID())
          WHERE id = v_existing_record;
      ELSE
          -- Drug doesn't exist in store, create a new entry
          INSERT INTO tblDrugInStore (drug_id, opening_quantity, threshold_limit, remaining_quantity, isAvailable, transaction_id)
          VALUES (p_drug_id, p_quantity_received, 0, p_quantity_received, 1, JSON_ARRAY(LAST_INSERT_ID()));
      END IF;
  END;
`);

try {
  sequelize.sync();
  console.log("Model User created successfully");
} catch (error) {
  console.error(`Table failed to create`, error);
}

export {
  User,
  Supplier,
  DrugReceived,
  DrugReleased,
  DrugInStore,
  Drug,
  DrugCategory,
};
