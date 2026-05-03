import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createNote, deleteNote, fetchNotes, updateNote } from "../services/note.services";

const notesKey = ["notes"];

export const useNotesQuery = () => {
  return useQuery({
    queryKey: notesKey,
    queryFn: fetchNotes,
    staleTime: 1000 * 30,
  });
};

export const useCreateNoteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notesKey });
    },
  });
};

export const useUpdateNoteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, noteData }) => updateNote(id, noteData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notesKey });
    },
  });
};

export const useDeleteNoteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notesKey });
    },
  });
};

export { notesKey };
