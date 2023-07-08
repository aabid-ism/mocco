import { useState } from "react";
import Navbar from "./components/Navbar";
import PreliminaryPosting from "./pages/PreliminaryPosting";
import ManageNewsHistory from "./pages/ManageNewsHistory";
import NewsPostApproval from "./pages/NewsPostApproval";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
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
      element: !user ? <SignIn /> : <Navigate to="/preliminary-posting" />,
    },
    {
      path: "/sign-up",
      element: !user ? <SignUp /> : <Navigate to="/preliminary-posting" />,
    },
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/preliminary-posting",
          element: user ? (
            <PreliminaryPosting open={open} setOpen={setOpen} />
          ) : (
            <Navigate to="/sign-up" />
          ),
        },
        {
          path: "/news-post-approval",
          element: user ? (
            <NewsPostApproval open={open} setOpen={setOpen} />
          ) : (
            <Navigate to="/sign-up" />
          ),
        },
        {
          path: "/manage-news-history",
          element: user ? (
            <ManageNewsHistory open={open} setOpen={setOpen} />
          ) : (
            <Navigate to="/sign-up" />
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
