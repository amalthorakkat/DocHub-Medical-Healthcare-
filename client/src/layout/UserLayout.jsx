import React from "react";
import Header from "../components/layoutComponents/Header";
import Footer from "../components/layoutComponents/Footer";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default UserLayout;
