import express from "express";
import * as controller from "../controllers/transaction.js";
import * as validation from "../validations/transaction.js";

const router = express.Router();

router.post("/add", validation.addTransaction, controller.addTransaction);

export default router;
