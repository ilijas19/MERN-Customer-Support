import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Login from "./pages/auth/Login.tsx";
import Register from "./pages/auth/Register.tsx";
import AuthRoute from "./components/Routes/AuthRoute.tsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";
import UserDash from "./pages/user/UserDash.tsx";
import OperatorDash from "./pages/operator/OperatorDash.tsx";
import AdminDash from "./pages/admin/AdminDash.tsx";
import RoleRedirect from "./components/RoleRedirect.tsx";
import AdminRoute from "./components/Routes/AdminRoute.tsx";
import OperatorRoute from "./components/Routes/OperatorRoute.tsx";
// import OperatorsPage from "./pages/admin/OperatorsPage.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="" element={<App />}>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />

      {/* USER ROUTES */}
      <Route path="/" element={<AuthRoute />}>
        <Route index element={<RoleRedirect />} />
        <Route path="user-dashboard" element={<UserDash />} />
      </Route>

      {/* OPERATOR ROUTES */}
      <Route path="operator-dashboard" element={<OperatorRoute />}>
        <Route index element={<OperatorDash />} />
      </Route>

      {/* ADMIN ROUTES */}
      <Route path="admin-dashboard" element={<AdminRoute />}>
        <Route index element={<AdminDash />} />
      </Route>
    </Route>
  )
);

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  </Provider>
);
