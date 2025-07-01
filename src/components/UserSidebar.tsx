import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DarkModeBtn from "../components/DarkModeBtn";

export interface User {
  email: string;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const UserSidebar: React.FC<SidebarProps> = ({ isOpen, onClose, user }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <div
      className={`flex flex-col fixed top-0 right-0 h-full w-[80%] md:w-[30%] lg:w-[20%] background2 bg-white shadow-lg p-6 transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="justify-self-start">
        {" "}
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-black mb-6 "
        >
          ✕ Close
        </button>
      </div>

      {user ? (
        <div className="mb-4 ">
          <p className="font-medium">Hello, {user.email}</p>
          <button
            onClick={() => {
              logout();
            }}
            className="w-full bg-red-500 text-white py-2 rounded mt-2"
          >
            Disconect
          </button>
        </div>
      ) : (
        <div className="mb-4 ">
          <p className="text-gray-600 mb-4 ">You are not signed in</p>
          <button
            onClick={() => {
              navigate("/auth");
              onClose();
            }}
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            Sign In / Register
          </button>
        </div>
      )}
      <div className="flex flex-grow"></div>
      <DarkModeBtn />
    </div>
  );
};

export default UserSidebar;
