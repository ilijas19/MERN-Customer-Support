import { ToastContainer } from "react-toastify";
import { Outlet } from "react-router-dom";

const App = () => {
  return (
    <div className="">
      <ToastContainer />
      <Outlet />
    </div>
  );
};
export default App;
