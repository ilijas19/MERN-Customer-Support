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
import AdminRoute from "./components/Routes/AdminRoute.tsx";
import OperatorRoute from "./components/Routes/OperatorRoute.tsx";
import OperatorsPage from "./pages/admin/OperatorsPage.tsx";
import Profile from "./pages/user/Profile.tsx";
import RedirectRoute from "./components/Routes/RedirectRoute.tsx";
import UsersPage from "./pages/operator/UsersPage.tsx";
import UsersProfile from "./pages/admin/UsersProfile.tsx";
import OperatorChat from "./pages/operator/OperatorChatPage.tsx";
import UserChat from "./pages/user/UserChat.tsx";
import UserInfo from "./pages/operator/UserInfo.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="" element={<App />}>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />

      {/* USER ROUTES */}
      <Route path="/" element={<AuthRoute />}>
        <Route index element={<RedirectRoute />} />
        <Route path="profile" element={<Profile />} />
        <Route path="chat" element={<UserChat />} />
      </Route>

      {/* OPERATOR ROUTES */}
      <Route path="" element={<OperatorRoute />}>
        <Route path="operatorChat" element={<OperatorChat />} />
        <Route path="info/:id" element={<UserInfo />} />
      </Route>

      {/* ADMIN ROUTES */}
      <Route path="" element={<AdminRoute />}>
        <Route path="operatorsList" element={<OperatorsPage />} />
        <Route path="usersList" element={<UsersPage />} />
        <Route path="profile/:id" element={<UsersProfile />} />
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
