import { useState, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./routers/Router";
import { BookingButton, Loader } from "./components";
import { useAuthStore } from "./store/authStore";
import { useZoomControl } from "./hooks/useZoomControl";
import { HelmetProvider } from "react-helmet-async";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "./config/axios";

const App = () => {
  const [isAppLoading, setIsAppLoading] = useState(true);

  const currentZoom = useZoomControl();
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppLoading(false);
      api.post("/t", { r: `${"/"}` });
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <HelmetProvider>
      <div className="text-black min-h-screen">
        {isAppLoading ? (
          <Loader />
        ) : (
          <RouterProvider router={router} fallbackElement={<Loader />} />
        )}
      </div>
      {/* <BookingButton /> */}
      <BookingButton />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </HelmetProvider>
  );
};

export default App;
