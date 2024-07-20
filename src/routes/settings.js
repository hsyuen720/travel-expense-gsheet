import express from "express";
import * as controller from "../controllers/settings.js";
import * as validation from "../validations/settings.js";
const router = express.Router();

router.get("/options", validation.getOptions, controller.getOptions);
router.post("/people", validation.addPeople, controller.addPeople);

export default router;
