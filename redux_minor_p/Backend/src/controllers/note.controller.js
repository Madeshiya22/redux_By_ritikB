import noteModel from "../models/note.model.js";

const createNote = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and Description are required" });
    }
    const note = new noteModel({ title, description, user_id: req.userId });
    await note.save();
    res.status(201).json({
      message: "Note created successfully",
      note,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllNotes = async (req, res) => {
  try {
    // Only fetch notes for the authenticated user
    const notes = await noteModel.find({ user_id: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: "Title and Description are required" });
    }
    // Check if note exists and belongs to the user
    const note = await noteModel.findById(id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    if (note.user_id.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized: You can only update your own notes" });
    }
    const updatedNote = await noteModel.findByIdAndUpdate(
      id,
      { title, description },
      { new: true },
    );
    res.status(200).json(updatedNote); 
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    // Check if note exists and belongs to the user
    const note = await noteModel.findById(id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    if (note.user_id.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized: You can only delete your own notes" });
    }
    await noteModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export { createNote, getAllNotes, updateNote, deleteNote };
