import { ToastContainer } from "react-toastify";
import { Outlet } from "react-router-dom";

const App = () => {
  return (
    <div className="bg-gray-800 min-h-screen text-white">
      <ToastContainer />
      <Outlet />
    </div>
  );
};
export default App;
