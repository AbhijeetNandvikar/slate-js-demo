import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import BasicDemo from "./basic-demo";
import ClinicalCodesExample from "./clinical-codes-example";
import HeadingOneDemo from "./heading-one-demo";

const router = createBrowserRouter([
  {
    path: "/basic-demo",
    element: <BasicDemo />,
  },
  {
    path: "/heading-one-demo",
    element: <HeadingOneDemo />,
  },
  {
    path: "/clinical-codes-example",
    element: <ClinicalCodesExample />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
