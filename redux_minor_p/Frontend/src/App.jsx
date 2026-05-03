import AuthPage from "./pages/AuthPage";
import NotesPage from "./pages/NotesPage";
import { useAuthSession } from "./hooks/useAuth";

const App = () => {
  const authSession = useAuthSession();
  const isAuthenticated = Boolean(authSession.data?.data?.user || localStorage.getItem("accessToken"));

  return isAuthenticated ? <NotesPage /> : <AuthPage />;
};

export default App;
