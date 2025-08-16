import { Router } from "express";
import {
  createClient,
  listClients,
  getClient,
  updateClientProfile,
  deleteClient,
  addRecommendation,
  updateRecommendation,
  deleteRecommendation,
  addExpense,
  updateExpense,
  deleteExpense,
  addWorkItem,
  updateWorkItem,
  deleteWorkItem,
  searchClients, // <- add import
} from "../controllers/clientController.js";

const router = Router();

router.post("/", createClient);
router.get("/", listClients);

// ✅ search must come BEFORE "/:id"
router.get("/search", searchClients);

router.get("/:id", getClient);
router.put("/:id", updateClientProfile);
router.delete("/:id", deleteClient);

router.post("/:id/recommendations", addRecommendation);
router.put("/:id/recommendations/:recommendationId", updateRecommendation);
router.delete("/:id/recommendations/:recommendationId", deleteRecommendation);

router.post("/:id/expenses", addExpense);
router.put("/:id/expenses/:expenseId", updateExpense);
router.delete("/:id/expenses/:expenseId", deleteExpense);

router.post("/:id/work-items", addWorkItem);
router.put("/:id/work-items/:workItemId", updateWorkItem);
router.delete("/:id/work-items/:workItemId", deleteWorkItem);

export default router;
