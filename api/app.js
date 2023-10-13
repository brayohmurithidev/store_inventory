import express from "express";
import bodyParser from "body-parser";
import userRoutes from "./src/routes/user.route.js";
import authRoutes from "./src/routes/auth.route.js";
import supplierRoutes from "./src/routes/supplier.route.js";
import drugRoutes from "./src/routes/drug.route.js";
import cookieParser from "cookie-parser";
import "./src/middleware/passport.config.js";

const app = express();
const port = 3001;

// app.use(passport.initialize());
app.use(cookieParser());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get("/api", (req, res) => {
  res.send("Testing api");
});

app.use("/api", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/drugs", drugRoutes);

app.listen(port, () => {
  console.log(`Api listening on port ${port}`);
});
