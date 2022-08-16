import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";
import App from "./app";
import Layout from "./components/ui/Layout";
import PersistLogin from "./components/utils/PersistLogin";
import RequireAuth from "./components/utils/RequireAuth";
import CheckEmailPage from "./pages/auth/CheckEmailPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import SignInPage from "./pages/auth/SignInPage";
import SignUpPage from "./pages/auth/SignUpPage";
import NotFoundPage from "./pages/NotFoundPage";
import UserProfilePage from "./pages/UserProfilePage";
import "./styles.css";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);

root.render(
    <React.StrictMode>
        <HelmetProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        {/* Protected Routes */}
                        <Route element={<PersistLogin />}>
                            <Route element={<RequireAuth />}>
                                <Route path="/" element={<App />} />
                                <Route
                                    path="/user-profile"
                                    element={<UserProfilePage />}
                                />
                            </Route>
                            <Route path="/signin" element={<SignInPage />} />
                        </Route>

                        {/* Public Routes */}
                        <Route path="/signup" element={<SignUpPage />} />

                        <Route
                            path="/reset-password"
                            element={<ResetPasswordPage />}
                        />
                        <Route
                            path="/check-email"
                            element={<CheckEmailPage />}
                        />
                        <Route
                            path="/forgot-password"
                            element={<ForgotPasswordPage />}
                        />
                        <Route path="*" element={<NotFoundPage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </HelmetProvider>
    </React.StrictMode>
);
