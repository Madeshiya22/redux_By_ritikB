import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCurrentUser, loginUser, registerUser } from "../services/auth.service";

const sessionKey = ["auth", "session"];

export const useAuthSession = () => {
  const token = localStorage.getItem("accessToken");

  return useQuery({
    queryKey: sessionKey,
    queryFn: fetchCurrentUser,
    enabled: Boolean(token),
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
};

export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem("accessToken", data?.data?.accessToken);
      localStorage.setItem("refreshToken", data?.data?.refreshToken);
      queryClient.setQueryData(sessionKey, data);
    },
  });
};

export const useRegisterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      localStorage.setItem("accessToken", data?.data?.accessToken);
      localStorage.setItem("refreshToken", data?.data?.refreshToken);
      queryClient.setQueryData(sessionKey, data);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return () => {
    // Clear tokens from localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    // Explicitly clear the session query so components using it re-render
    queryClient.setQueryData(sessionKey, null);

    // Invalidate notes so they update/empty immediately
    queryClient.invalidateQueries({ queryKey: ["notes"] });

    // Remove other non-persistent queries to avoid leaking user data
    // (keeps the update synchronous and avoids a full cache clear)
    queryClient.removeQueries({ predicate: (query) => true });
  };
};