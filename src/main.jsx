import React from "react";
import ReactDOM from "react-dom/client";
import ErrorPage from "./ErrorPage.jsx";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/root.jsx";
import Festival, { loader as festivalLoader } from "./routes/festival.jsx";
import Index, { loader as indexLoader } from "./routes/index.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Index />, loader: indexLoader },
      {
        path: "festivals/:festivalId",
        element: <Festival />,
        loader: festivalLoader,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
