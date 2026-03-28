import {useDispatch, useSelector} from "react-redux";
import {fetchNotesApi, createNoteApi, updateNoteApi, deleteNoteApi} from "../redux/slice/noteSlice";

export const useNote = () => {
    const dispatch = useDispatch();
    const {notes, status, error} = useSelector((state) => state.note);

    const fetchNotes = () => dispatch(fetchNotesApi());
    const createNote = (noteData) => dispatch(createNoteApi(noteData));
    const updateNote = (id, noteData) => dispatch(updateNoteApi({id, noteData}));
    const deleteNote = (id) => dispatch(deleteNoteApi(id));

    return {
        notes,
        status,
        error,
        fetchNotes,
        createNote,
        updateNote,
        deleteNote
    };
};
