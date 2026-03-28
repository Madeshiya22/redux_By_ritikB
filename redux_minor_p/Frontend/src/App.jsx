import React, { useState, useEffect } from "react";
import { PencilLine, Trash2, X, NotebookPen } from "lucide-react";
import "./App.css"; // Importing the separate styles
import { useNote } from "./hook/useNote";

const App = () => {
  const { notes, status, fetchNotes, createNote, updateNote, deleteNote } = useNote();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null); // Track the note being edited

  // Fetch true notes from backend on mount
  useEffect(() => {
    fetchNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) return;

    if (editingNoteId !== null) {
      await updateNote(editingNoteId, { title, description });
    } else {
      await createNote({ title, description });
    }

    // Reset Form
    setTitle("");
    setDescription("");
    setEditingNoteId(null);
    setIsFormOpen(false);
  };

  const handleDelete = (id) => {
    deleteNote(id);
  };

  const handleEdit = (id) => {
    const noteToEdit = notes.find((n) => n.id === id || n._id === id);
    if (!noteToEdit) return;

    setTitle(noteToEdit.title);
    setDescription(noteToEdit.description);
    setEditingNoteId(id); // Set the active id so we don't delete until save
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setTitle("");
    setDescription("");
    setEditingNoteId(null); // Just close without saving, note remains intact
  };

  return (
    <div className="app-container">
      {/* Navbar Section */}
      <nav className="navbar">
        <div className="nav-logo">
          <NotebookPen size={30} />
        </div>
        <button className="btn-create-note" onClick={() => setIsFormOpen(true)}>
          + Create Note
        </button>
      </nav>

      <div className="main-content">
        {/* Form Overlay/Section */}
        {isFormOpen && (
          <div className="form-modal">
            <button
              onClick={handleCloseForm}
              className="close-btn"
              title="Close"
            >
              <X size={24} />
            </button>
            <h2 className="form-title">
              {editingNoteId ? "Edit Note" : "Create Note"}
            </h2>

            <form onSubmit={handleSubmit} className="note-form">
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-input"
              />
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                className="form-input"
              />
              <button type="submit" className="btn-save">
                Save
              </button>
            </form>
          </div>
        )}

        {/* Notes List */}
        <div className="notes-grid">
          {notes.length === 0 && !isFormOpen && (
            <p className="no-notes">
              No notes found. Click &quot;+ Create Note&quot; to add one.
            </p>
          )}

          {notes.map((note) => {
            const noteId = note._id || note.id;
            return (
            <div key={noteId} className="note-card">
              <div className="note-content">
                <h3 className="note-title">{note.title}</h3>
                <p className="note-desc">{note.description}</p>
              </div>
              <div className="note-actions">
                <button
                  onClick={() => handleEdit(noteId)}
                  className="icon-btn-edit"
                  title="Edit"
                >
                  <PencilLine size={16} />
                </button>
                <button
                  onClick={() => handleDelete(noteId)}
                  className="icon-btn-delete"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default App;
