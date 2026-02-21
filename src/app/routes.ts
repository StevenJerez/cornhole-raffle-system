import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import { RegistrationForm } from "./components/RegistrationForm";
import Confirmation from "./pages/Confirmation";
import InternalDashboard from "./pages/InternalDashboard";
import InternalDraw from "./pages/InternalDraw";

export const router = createBrowserRouter(
  [
    {
      path: "/ifa2026",
      Component: Home,
    },
    {
      path: "/ifa2026/register",
      Component: RegistrationForm,
    },
    {
      path: "/ifa2026/confirmation",
      Component: Confirmation,
    },
    {
      path: "/ifa2026/internal",
      Component: InternalDashboard,
    },
    {
      path: "/ifa2026/internal-draw",
      Component: InternalDraw,
    },
  ]
);