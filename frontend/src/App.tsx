import { ToastContainer } from "react-toastify";
import { Outlet } from "react-router-dom";
import Navigation from "./pages/layout/Navigation";

const App = () => {
  return (
    <div className="bg-gradient-to-b from-gray-800 to-gray-900 min-h-screen text-white">
      <Navigation />
      <div className="max-w-[1200px] mx-auto ">
        <ToastContainer />
        <Outlet />
      </div>
    </div>
  );
};
export default App;
