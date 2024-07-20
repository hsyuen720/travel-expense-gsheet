import "dotenv/config";
import express from "express";

import settingRoutes from "./routes/settings.js";
import transactionRoutes from "./routes/transaction.js";
import sheetsRoutes from "./routes/sheets.js";

const app = express();

app.use(express.json());

// Routes
app.use("/settings", settingRoutes);
app.use("/sheets", sheetsRoutes);
app.use("/transaction", transactionRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
