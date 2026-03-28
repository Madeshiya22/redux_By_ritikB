import { Router } from "express";
import { createNote, updateNote, deleteNote, getAllNotes } from "../controllers/note.controller.js";

const router = Router();

router.post("/", createNote);
router.get("/", getAllNotes);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;