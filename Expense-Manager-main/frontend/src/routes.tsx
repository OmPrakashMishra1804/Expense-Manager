import React from "react";
import { BrowserRouter, Routes as RoutesList, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import TransactionsPage from './pages/Transactions/index';
import Profile from './pages/profile';

// Layout with Navbar
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
);

// PrivateRoute component
const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const token = localStorage.getItem("expToken");
  return token ? children : <Navigate to="/login" replace />;
};

const Router: React.FC = () => {
  const token = localStorage.getItem("expToken");
  return (
    <BrowserRouter>
      <RoutesList>
        <Route
          path="/dashboard"
          element={
            <AppLayout>
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            </AppLayout>
          }
        />
        <Route
          path="/"
          element={
            <AppLayout>
              <Home />
            </AppLayout>
          }
        />
        <Route
          path="/login"
          element={
            !token ? <Login /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/signup"
          element={
            !token ? <Register /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/transactions"
          element={
            <AppLayout>
              <PrivateRoute>
                <TransactionsPage />
              </PrivateRoute>
            </AppLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <AppLayout>
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            </AppLayout>
          }
        />
      </RoutesList>
    </BrowserRouter>
  );
};

export default Router; 