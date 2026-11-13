import { RouteObject, RouterProvider, createBrowserRouter } from "react-router";

import Editor from "../../pages/editor";
import Login from "../../pages/login";
import Monitor from "../../pages/monitor";
import NotFound from "../../pages/not-found";
import PatientHistory from "../../pages/patient-history";
import Search from "../../pages/search";
import Header from "../../widgets/header";

import ProtectedRoute from "./ProtectedRoute";

function AuthRoutes() {
  const routes: RouteObject[] = [
    {
      // Public routes
      path: "/",
      Component: Header,
      children: [
        {
          path: "login",
          Component: Login,
        },
        {
          path: "notfound",
          Component: NotFound,
        },
        {
          path: "*",
          Component: NotFound,
        },
        {
          // Routes for authenticated users only
          Component: ProtectedRoute,
          children: [
            {
              index: true,
              Component: Monitor,
            },
            {
              path: "patients",
              children: [
                {
                  path: ":patientId",
                  Component: PatientHistory,
                },
              ],
            },
            {
              path: "search",
              Component: Search,
            },
            {
              path: "editor",
              Component: Editor,
              children: [
                {
                  path: ":editorId",
                  Component: Editor,
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  const router = createBrowserRouter(routes);
  return <RouterProvider router={router} />;
}

export default AuthRoutes;
