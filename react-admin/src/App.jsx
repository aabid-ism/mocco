import { useState } from "react";
import Sidebar from "./components/Sidebar";
import PublishNews from "./pages/PublishNews";
import ManageNewsHistory from "./pages/ManageNewsHistory";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

function App() {
  const [open, setOpen] = useState(true);

  const Layout = () => {
    return (
      <>
        <Sidebar open={open} setOpen={setOpen} />
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
          element: <PublishNews open={open} setOpen={setOpen} />,
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
