import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";

const Guard = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <span className="font-serif text-xl text-on-surface-variant">
          Loading…
        </span>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/*"
            element={
              <Guard>
                <DashboardPage />
              </Guard>
            }
          />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-right"
        gutter={8}
        toastOptions={{
          duration: 3200,
          style: {
            borderRadius: "12px",
            padding: "12px 14px",
          },
          success: {
            style: { background: "#236756", color: "#f8efea" },
            iconTheme: { primary: "#f8efea", secondary: "#236756" },
          },
          error: {
            style: { background: "#b3261e", color: "#ffffff" },
            iconTheme: { primary: "#ffffff", secondary: "#b3261e" },
          },
        }}
      />
    </AuthProvider>
  );
}

export default App;
