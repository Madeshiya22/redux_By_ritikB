import { Router } from "express";
import { createNote, updateNote, deleteNote, getAllNotes } from "../controllers/note.controller.js";
import { authenticateToken } from "../auth/middleware/jwt.middleware.js";

const router = Router();

// Apply authentication to all note routes
router.use(authenticateToken);

router.post("/", createNote);
router.get("/", getAllNotes);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;