import noteModel from "../models/note.model.js";

const createNote = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and Description are required" });
    }
    const note = new noteModel({ title, description });
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
    const notes = await noteModel.find().sort({ createdAt: -1 }); // ye .sort ye find kr raha hai database se pahale aur latest notes
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
    const note = await noteModel.findByIdAndUpdate(
      id,
      { title, description },
      { new: true },
    );
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.status(200).json(note); 
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await noteModel.findByIdAndDelete(id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.status(200).json({ message: "Note deleted successfully" });
  }
    catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export { createNote, getAllNotes, updateNote, deleteNote };
