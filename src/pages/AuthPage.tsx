import React from "react";
import AuthForm from "../components/AuthForm";

const AuthPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg dark:bg-gray-700">
        <h2 className="text-2xl font-bold text-center mb-6 dark:text-white">
          Welcome to ShopClone
        </h2>
        <AuthForm />
      </div>
    </div>
  );
};

export default AuthPage;
