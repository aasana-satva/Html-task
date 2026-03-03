import {createBrowserRouter , RouterProvider} from "react-router-dom";
import Layout from "./Components/Layout";
import Home from "./Components/Home";
import About from "./Components/About";
import UserDetails from "./Components/UserDetails";


const router = createBrowserRouter([
  {
    path:"/",
    element :<Layout />,
    children:[
      {
        index:true,
        element: <Home />
      },
      {
        path :"about",
        element:<About />
      },
      {
        path :"user/:id",
        element:<UserDetails />
      }
    ]
  }
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
