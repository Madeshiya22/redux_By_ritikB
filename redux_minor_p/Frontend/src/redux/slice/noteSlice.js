import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {fetchNotes, createNote, updateNote, deleteNote} from "../../services/note.services";

export const fetchNotesApi = createAsyncThunk('note/fetchNotes', async (_, {rejectWithValue}) => {
    try {
        const response = await fetchNotes();
        return response; // returning the data
    } catch (error) {
        return rejectWithValue(error.response?.data || "Error fetching notes");
    }
});

export const createNoteApi = createAsyncThunk(
    'note/createNote',
    async (noteData, {rejectWithValue}) => {    
        try {
            const response = await createNote(noteData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Error creating note");
        }
    }
);

export const updateNoteApi = createAsyncThunk(
    'note/updateNote',
    async ({id, noteData}, {rejectWithValue}) => {
        try {
            const response = await updateNote(id, noteData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Error updating note");
        }
    }
);

export const deleteNoteApi = createAsyncThunk(
    'note/deleteNote',
    async (id, {rejectWithValue}) => {
        try {
            await deleteNote(id);
            return id; // Return the deleted id
        } catch (error) {
            return rejectWithValue(error.response?.data || "Error deleting note");
        }
    }
);

const noteSlice = createSlice({
    name: 'note',
    initialState: {
        notes: [],
        status:"idle", // ye kaam aayega jab hum API call karenge to uska status track karne ke liye
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Notes
            .addCase(fetchNotesApi.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchNotesApi.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.notes = action.payload || []; // Make sure your backend returns an array here
            })
            .addCase(fetchNotesApi.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Create Note
            .addCase(createNoteApi.fulfilled, (state, action) => {
                state.notes.push(action.payload);
            })
            // Update Note
            .addCase(updateNoteApi.fulfilled, (state, action) => {
                const index = state.notes.findIndex(note => note._id === action.payload._id);
                if (index !== -1) {
                    state.notes[index] = action.payload;
                }
            })
            // Delete Note
            .addCase(deleteNoteApi.fulfilled, (state, action) => {
                state.notes = state.notes.filter(note => note._id !== action.payload);
            });
    }
});

export default noteSlice.reducer;