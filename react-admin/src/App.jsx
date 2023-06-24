import { useState } from "react";
import Navbar from "./components/Navbar";
import PreliminaryPosting from "./pages/PreliminaryPosting";
import ManageNewsHistory from "./pages/ManageNewsHistory";
import NewsPostApproval from "./pages/NewsPostApproval";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

function App() {
  const [open, setOpen] = useState(true);

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
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <PreliminaryPosting open={open} setOpen={setOpen} />,
        },
        {
          path: "/news-post-approval",
          element: <NewsPostApproval open={open} setOpen={setOpen} />,
        },
        {
          path: "/manage-news-history",
          element: <ManageNewsHistory open={open} setOpen={setOpen} />,
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
