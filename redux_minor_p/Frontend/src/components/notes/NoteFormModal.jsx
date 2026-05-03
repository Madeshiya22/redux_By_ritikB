import { X } from "lucide-react";

const NoteFormModal = ({ isOpen, onClose, onSubmit, title, setTitle, description, setDescription, editingNoteId }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="form-modal">
      <button onClick={onClose} className="close-btn" title="Close" type="button">
        <X size={24} />
      </button>
      <h2 className="form-title">{editingNoteId ? "Edit Note" : "Create Note"}</h2>

      <form onSubmit={onSubmit} className="note-form">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="form-input"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows="4"
          className="form-input"
        />
        <button type="submit" className="btn-save">
          Save
        </button>
      </form>
    </div>
  );
};

export default NoteFormModal;
