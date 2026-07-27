import AdminAuthProvider from "./context/AdminAuthProvider";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <AdminAuthProvider>
      <AppRoutes />
    </AdminAuthProvider>
  );
}

export default App;
