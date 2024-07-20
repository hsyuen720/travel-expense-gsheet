import express from "express";
import * as controller from "../controllers/sheets.js";
import * as validation from "../validations/sheets.js";
const router = express.Router();

router.post("/setup", validation.setupSheets, controller.setupSheets);

export default router;
