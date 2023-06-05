import React from "react";
import ReactDOM from "react-dom/client";
import ErrorPage from "./ErrorPage.jsx";
import "./index.css";
import "./main.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/root.jsx";
import Festival, { loader as festivalLoader } from "./routes/festival.jsx";
import Index, { loader as indexLoader } from "./routes/index.jsx";
import Schedule from "./components/timeline/Schedule.jsx";
import Profile from "./routes/profile.jsx";
import HappeningNow from "./components/timeline/HappeningNow.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Index />, loader: indexLoader },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: ":festivalId",
        element: <Festival />,
        loader: festivalLoader,
        children: [
          { index: true, element: <Schedule /> },
          { path: "now", element: <HappeningNow /> },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
