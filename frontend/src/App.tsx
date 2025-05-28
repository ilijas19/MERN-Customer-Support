import { ToastContainer } from "react-toastify";
import { Outlet } from "react-router-dom";
import Navigation from "./pages/layout/Navigation";

const App = () => {
  return (
    <div className="bg-gradient-to-b from-gray-800 to-gray-900 min-h-screen text-white flex flex-col">
      <Navigation />
      <div className="flex-1  flex">
        <ToastContainer />
        <Outlet />
      </div>
    </div>
  );
};
export default App;
