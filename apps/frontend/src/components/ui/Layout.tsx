import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { themeStore } from "../../zustand/themeStore";

const Layout = () => {
  const { theme, applyTheme } = themeStore();
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <>
      <ToastContainer
        toastStyle={{
          width: "max-content",
          background: theme === "dark" ? "#161A1D" : "#fff",
          border: "2px solid",
          borderColor: theme === "dark" ? "#0d7377" : "#2195ed",
          color: theme === "dark" ? "#fff" : "#000",
        }}
        hideProgressBar={true}
        autoClose={2000}
        position="top-center"
      />
      <Outlet />
    </>
  );
};

export default Layout;
