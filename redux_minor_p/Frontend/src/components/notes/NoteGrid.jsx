import NoteCard from "./NoteCard";

const NoteGrid = ({ notes, onEdit, onDelete, emptyMessage, isBusy }) => {
  if (!isBusy && notes.length === 0) {
    return <p className="no-notes">{emptyMessage}</p>;
  }

  return (
    <div className="notes-grid">
      {notes.map((note) => (
        <NoteCard key={note._id || note.id} note={note} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default NoteGrid;
