import { useState } from "react";
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
import Events from "./pages/Events";
import Quotes from "./pages/Quotes";


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
            <>
              <Navigate to="/create-post" />
              <CreatePost open={open} setOpen={setOpen} />
            </>
          ) : (
            <Navigate to="/" />
          ),
        },
        {
          path: "/edit-and-publish-post",
          element: user ? (
            <>
              <Navigate to="/edit-and-publish-post" />
              <EditAndPublish open={open} setOpen={setOpen} />
            </>
          ) : (
            <Navigate to="/" />
          ),
        },
        {
          path: "/manage-news-history",
          element: user ? (
            <>
              <Navigate to="/manage-news-history" />
              <ManageNewsHistory open={open} setOpen={setOpen} />
            </>
          ) : (
            <Navigate to="/" />
          ),
        },
        {
          path: "/events",
          element: user ? (
            <>
              <Navigate to="/events" />
              <Events open={open} setOpen={setOpen} />
            </>
          ) : (
            <Navigate to="/" />
          ),
        },
        {
          path: "/quotes",
          element: user ? (
            <>
              <Navigate to="/quotes" />
              <Quotes open={open} setOpen={setOpen} />
            </>

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
