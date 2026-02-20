import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import { RegistrationForm } from "./components/RegistrationForm";
import Confirmation from "./pages/Confirmation";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      Component: Home,
    },
    {
      path: "/register",
      Component: RegistrationForm,
    },
    {
      path: "/confirmation",
      Component: Confirmation,
    },
  ],
  {
    basename: "/ifa2026",
  }
);