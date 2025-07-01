import React, { useState } from "react";
import UserSidebar from "../components/UserSidebar";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export interface User {
  email: string;
}

const Header: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="background2 bg-white shadow-md px-4 py-3 flex justify-between items-center">
      <h1 className="text-xl font-bold">ShopClone</h1>
      <button
        onClick={() => {
          navigate("/cart");
        }}
        className="bg-amber-200 text-black p-2 rounded"
      >
        Go to Cart
      </button>
      <button
        onClick={() => {
          navigate("/shop");
        }}
        className="bg-amber-200 text-black p-2 rounded"
      >
        Go to shop
      </button>
      <button
        onClick={() => setSidebarOpen(true)}
        className="rounded-full w-10 h-10 bg-gray-200 flex items-center justify-center"
      >
        👤
      </button>

      <UserSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
      />
    </header>
  );
};

export default Header;
