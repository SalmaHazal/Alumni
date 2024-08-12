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
import NotificationsPage from "./scenes/notifs/Notifications";
import SinglePostPage from "./scenes/widgets/SinglePostPage";
import LiveStreamPage from "./scenes/streaming/streamingPage";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import ChattingPage from "./scenes/chattingPage/ChattingPage";
import MessagePage from "./scenes/widgets/MessagePage";
import JobList from "./scenes/jobs/JobList";
import JobPostForm from "./scenes/jobs/JobPostForm";
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
      path: "/forgot-password",
      element: <ForgotPassword />,

    },
    {
      path: "/live/:userId",
      element: <LiveStreamPage />,

    },
    {
      path: "/post-jobs",
      element: isAuth ? <JobList /> : <Navigate to="/" />,
    },
    {
      path: "/job-form",
      element: isAuth ? <JobPostForm /> : <Navigate to="/" />,
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
    {
      path: "/notifications",
      element: <NotificationsPage />,
    },
    {
      path: "/posts/:postId",
      element: isAuth ? <SinglePostPage /> : <Navigate to="/" />, 
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
