import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateUser from "./components/admin/CreateUser";
import Prodotti from "./components/admin/Prodotti";
import UserProdotti from "./components/user/UserProdotti";
import { jwtDecode } from "jwt-decode";
import Table from "./pages/Table";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token") !== null;
  if (!isAuthenticated) return <Navigate to="/" />;
  return children;
};

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/" />;

  try {
    const decoded = jwtDecode(token);
    if (decoded.role !== "admin") {
      return <Navigate to="/Dashboard" />;
    }
    return children;
  } catch {
    return <Navigate to="/" />;
  }
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Table />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/Dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-user"
          element={
            <AdminRoute>
              <CreateUser />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <AdminRoute>
              <Prodotti isAdmin={true} />
            </AdminRoute>
          }
        />
        <Route
          path="/products"
          element={
            <PrivateRoute>
              <UserProdotti />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
