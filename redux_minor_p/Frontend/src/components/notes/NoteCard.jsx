import { PencilLine, Trash2 } from "lucide-react";

const NoteCard = ({ note, onEdit, onDelete }) => {
  const noteId = note._id || note.id;

  return (
    <div className="note-card">
      <div className="note-content">
        <h3 className="note-title">{note.title}</h3>
        <p className="note-desc">{note.description}</p>
      </div>
      <div className="note-actions">
        <button onClick={() => onEdit(noteId)} className="icon-btn-edit" title="Edit" type="button">
          <PencilLine size={16} />
        </button>
        <button onClick={() => onDelete(noteId)} className="icon-btn-delete" title="Delete" type="button">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default NoteCard;
