import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import HomePage from "./scenes/homePage/HomePage";
import LoginPage from "./scenes/loginPage/LoginPage";
import ForgotPassword from "./scenes/loginPage/ForgotPassword";
import ResetPassword from "./scenes/loginPage/ResetPassword";
import ProfilePage from "./scenes/profilePage/ProfilePage";
import EditProfilePage from "./scenes/modify/EditProfilePage";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import ChattingPage from "./scenes/chattingPage/ChattingPage";
import MessagePage from "./scenes/widgets/MessagePage";
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import CommunityMessages from "./scenes/widgets/CommunityMessages";

function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));

  const router = createBrowserRouter([
    {
      path: "/",
      element: <LoginPage />,
    },
    {
      path: "/home",
      element: isAuth ? <HomePage /> : <Navigate to="/" />,
    },
    {
      path: "/profile/:userId",
      element: <ProfilePage />,
    },
    {
      path: "/edit-profile",
      element: <EditProfilePage />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />,

    },
    {
      path: "/reset_password/:id/:token",
      element: <ResetPassword />

    },
    {
      path: "/chat",
      element: <ChattingPage />,
      children: [
        {
          path: ":userId",
          element: <MessagePage />,
        },
        {
          path: "community",
          element: < CommunityMessages />
        },

      ],
    },
  ]);

  return (
    <div className="app">
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <RouterProvider router={router} />
      </ThemeProvider>
    </div>
  );
}

export default App;
