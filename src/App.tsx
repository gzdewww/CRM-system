import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.scss";
import TodoListPage from "./pages/TodoListPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <TodoListPage />,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
