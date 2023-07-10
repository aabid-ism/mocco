import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import CreatePost from "./pages/CreatePost";
import ManageNewsHistory from "./pages/ManageNewsHistory";
import EditAndPublish from "./pages/EditAndPublish";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";
import SignIn from "./pages/SignIn";
// import SignUp from "./pages/SignUp";
import { useAuthContext } from "./hooks/useAuthContext";

function App() {
  const [open, setOpen] = useState(true);
  const { user } = useAuthContext();

  const Layout = () => {
    return (
      <>
        <Navbar open={open} setOpen={setOpen} />
        <Outlet />
      </>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: !user ? <SignIn /> : <Navigate to="/create-post" />,
    },
    // {
    //   path: "/sign-up",
    //   element: !user ? <SignUp /> : <Navigate to="/create-post" />,
    // },
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/create-post",
          element: user ? (
            <CreatePost open={open} setOpen={setOpen} />
          ) : (
            <Navigate to="/" />
          ),
        },
        {
          path: "/edit-and-publish-post",
          element: user ? (
            <EditAndPublish open={open} setOpen={setOpen} />
          ) : (
            <Navigate to="/" />
          ),
        },
        {
          path: "/manage-news-history",
          element: user ? (
            <ManageNewsHistory open={open} setOpen={setOpen} />
          ) : (
            <Navigate to="/" />
          ),
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  );
}

export default App;
