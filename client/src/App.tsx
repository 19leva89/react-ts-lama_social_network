import { useContext, ReactNode, ReactElement } from "react";
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from "react-router-dom";

import { AuthContext, AuthContextType } from "./context/authContext";
import { DarkModeContext, DarkModeContextType } from "./context/darkModeContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Home from "./pages/home";
import Login from "./pages/login";
import Profile from "./pages/profile";
import Register from "./pages/register";

import Navbar from "./components/navbar";
import LeftBar from "./components/leftBar";
import RightBar from "./components/rightBar";

import "./scss/app.scss";

function App() {
  const { currentUser } = useContext(AuthContext) as AuthContextType;
  const { darkMode } = useContext(DarkModeContext) as DarkModeContextType;

  const queryClient = new QueryClient();

  const Layout = () => {
    return (
      <QueryClientProvider client={queryClient}>
        <div className={`theme-${darkMode ? "dark" : "light"}`}>
          <Navbar />
          <div style={{ display: "flex" }}>
            <LeftBar />
            <div style={{ flex: 6 }}>
              <Outlet />
            </div>
            <RightBar />
          </div>
        </div>
      </QueryClientProvider>
    );
  };

  interface ProtectedRouteProps {
    children: ReactNode;
  }

  const ProtectedRoute = ({ children }: ProtectedRouteProps): ReactElement | null => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }

    return <>{children}</>;
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/profile/:id",
          element: <Profile />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
