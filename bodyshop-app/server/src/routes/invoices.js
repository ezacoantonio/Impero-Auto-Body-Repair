import { Router } from "express";
import { generateInvoice } from "../controllers/invoiceController.js";
const router = Router();
router.get("/:id", generateInvoice);
export default router;
