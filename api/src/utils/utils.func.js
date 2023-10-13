import logger from "./logger.js";
export const allKeysAndValues = (keysArray, objeTocheck) => {
  const checkAllKeys = keysArray.every((key) => {
    if (
      objeTocheck.hasOwnProperty(key) &&
      objeTocheck[key] !== undefined &&
      objeTocheck[key] !== null &&
      objeTocheck[key] !== ""
    ) {
      return true;
    } else {
      return false;
    }
  });
  if (checkAllKeys) {
    return true;
  } else {
    return false;
  }
};

export const errorLogger = (req, error) => {
  return logger.error(
    {
      url: req?.originalUrl,
      method: req?.method,
      user_id: req?.user_id,
      error: error,
      node_version: process.version,
    },
    "An unexpected error occurred while processing the request"
  );
};

export function handleMySQLError(errorCode) {
  switch (errorCode) {
    case "ER_DUP_ENTRY":
      return "Duplicate entry: The record you are trying to insert already exists.";

    case "ER_NO_REFERENCED_ROW_2":
      return "Referenced row not found: The referenced row in the parent table does not exist.";

    case "ER_PARSE_ERROR":
      return "Syntax error: There is a syntax error in your SQL query.";

    case "ER_ACCESS_DENIED_ERROR":
      return "Access denied: You do not have the necessary permissions to perform this action.";

    case "ER_TABLE_EXISTS_ERROR":
      return "Table already exists: A table with the same name already exists in the database.";

    case "ER_LOCK_WAIT_TIMEOUT":
      return "Lock wait timeout exceeded: The transaction is waiting too long for a lock.";

    case "ER_BAD_FIELD_ERROR":
      return "Unknown column: The specified column does not exist in the table.";

    default:
      return "An error occurred with error code: " + errorCode;
  }
}

export const checkIfAllKeysAreValid = (data, model) => {
  const modelAttributes = Object.keys(model.rawAttributes);
  const invalidKeys = Object.keys(data).filter(
    (key) => !modelAttributes.includes(key)
  );

  if (invalidKeys.length > 0) {
    return false;
  } else {
    return true;
  }
};
