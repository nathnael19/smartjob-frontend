import { Outlet } from "react-router-dom";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";

export const MainLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
