import { useEffect, useMemo, useRef, useState } from "react";
import { useAuthSession, useLogout } from "../../hooks/useAuth";
import {
  useCreateNoteMutation,
  useDeleteNoteMutation,
  useNotesQuery,
  useUpdateNoteMutation,
} from "../../hooks/useNotes";
import NotesNavbar from "./NotesNavbar";
import NoteFormModal from "./NoteFormModal";
import NoteGrid from "./NoteGrid";

const NotesPage = () => {
  const authSession = useAuthSession();
  const logout = useLogout();
  const notesQuery = useNotesQuery();
  const createNoteMutation = useCreateNoteMutation();
  const updateNoteMutation = useUpdateNoteMutation();
  const deleteNoteMutation = useDeleteNoteMutation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim().toLowerCase());
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [searchTerm]);

  useEffect(() => {
    if (isSearchOpen) {
      window.setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isSearchOpen]);

  const isAuthenticated = Boolean(authSession.data?.data?.user || localStorage.getItem("accessToken"));

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title || !description) return;

    if (editingNoteId !== null) {
      await updateNoteMutation.mutateAsync({ id: editingNoteId, noteData: { title, description } });
    } else {
      await createNoteMutation.mutateAsync({ title, description });
    }

    setTitle("");
    setDescription("");
    setEditingNoteId(null);
    setIsFormOpen(false);
  };

  const handleDelete = async (id) => {
    await deleteNoteMutation.mutateAsync(id);
  };

  const handleEdit = (id) => {
    const noteToEdit = notesQuery.data?.find((note) => note.id === id || note._id === id);
    if (!noteToEdit) return;

    setTitle(noteToEdit.title);
    setDescription(noteToEdit.description);
    setEditingNoteId(id);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setTitle("");
    setDescription("");
    setEditingNoteId(null);
  };

  const handleToggleSearch = () => {
    setIsSearchOpen((current) => {
      const nextValue = !current;

      if (!nextValue) {
        setSearchTerm("");
        setDebouncedSearchTerm("");
      }

      return nextValue;
    });
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    if (event.target.value) {
      setIsSearchOpen(true);
    }
  };

  const filteredNotes = useMemo(() => {
    const notes = notesQuery.data || [];

    if (!debouncedSearchTerm) {
      return notes;
    }

    return notes.filter((note) => {
      const title = String(note.title || "").toLowerCase();
      const description = String(note.description || "").toLowerCase();

      return title.includes(debouncedSearchTerm) || description.includes(debouncedSearchTerm);
    });
  }, [debouncedSearchTerm, notesQuery.data]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="app-container">
      <NotesNavbar
        onCreate={() => setIsFormOpen(true)}
        onLogout={logout}
        searchTerm={searchTerm}
        isSearchOpen={isSearchOpen}
        onToggleSearch={handleToggleSearch}
        onSearchChange={handleSearchChange}
        searchInputRef={searchInputRef}
      />

      <div className="main-content">
        {notesQuery.isError && (
          <div className="auth-error" style={{ marginBottom: "1rem" }}>
            <span>{notesQuery.error?.message || "Failed to load notes"}</span>
          </div>
        )}

        <NoteFormModal
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          editingNoteId={editingNoteId}
        />

        <NoteGrid
          notes={filteredNotes}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyMessage={
            debouncedSearchTerm
              ? "No matching notes found for your search."
              : 'No notes found. Click "+ Create Note" to add one.'
          }
          isBusy={isFormOpen || notesQuery.isLoading}
        />
      </div>
    </div>
  );
};

export default NotesPage;
