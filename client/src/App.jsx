import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import { useTranslation } from 'react-i18next'; // Import from react-i18next

import HomePage from "./scenes/homePage/HomePage";
import LoginPage from "./scenes/loginPage/LoginPage";
import ForgotPassword from "./scenes/loginPage/ForgotPassword";
import ResetPassword from "./scenes/loginPage/ResetPassword";
import ProfilePage from "./scenes/profilePage/ProfilePage";
import NotificationsPage from "./scenes/notifs/Notifications";
import SinglePostPage from "./scenes/widgets/SinglePostPage";
import Settings from "./scenes/settings/Settings";
import Choselang from "./scenes/language/choselang";
import ChattingPage from "./scenes/chattingPage/ChattingPage";
import MessagePage from "./scenes/widgets/MessagePage";
import CommunityMessages from "./scenes/widgets/CommunityMessages";
import Light_Dark from "./scenes/Light&Dark_mode/Light_Dark";
import Activitylog from "./scenes/Activity/Activitylog";
import Privacypage from "./scenes/Privacypage/Privacypage";
import Helppage from "./scenes/Helppage/Helppage";
import Feedbackpage from "./scenes/Feedbackpage/Feddbackpage";
import Passwordpage from "./scenes/Passwordpage/Passwordpage";
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import JobList from "./scenes/jobs/JobList";
import JobPostForm from "./scenes/jobs/JobPostForm";
import Services from "./scenes/widgets/Services";

function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));

  const { i18n } = useTranslation(); // Access i18n for language detection

  // Use useEffect to set the direction based on language
  useEffect(() => {
    const currentLanguage = i18n.language;

    // Check if the language is Arabic and set the direction to RTL
    if (currentLanguage === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl'); // Set to RTL
    } else {
      document.documentElement.setAttribute('dir', 'ltr'); // Set to LTR for other languages
    }
  }, [i18n.language]); // Re-run effect when language changes

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
      path: "/reset_password/:id/:token",
      element: <ResetPassword />,
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
      path: "/chat",
      element: <ChattingPage />,
      children: [
        {
          path: ":userId",
          element: <MessagePage />,
        },
        {
          path: "community",
          element: <CommunityMessages />,
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
    {
      path: "/settings",
      element: <Settings />,
    },
    {
      path: "/choselang",
      element: <Choselang />,
    },
    {
      path: "/Light_Dark",
      element: <Light_Dark />,
    },
    {
      path: "/Activitylog",
      element: <Activitylog />,
    },
    {
      path: "/Privacypage",
      element: <Privacypage />,
    },
    {
      path: "/Helppage",
      element: <Helppage />,
    },
    {
      path: "/Feedbackpage",
      element: <Feedbackpage />,
    },
    {
      path: "/Passwordpage",
      element: <Passwordpage />,
    },
    {
      path: "/Services",
      element: <Services />,
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
