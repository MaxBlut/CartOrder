import React, { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

const AuthForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true); //boolean to know if the user whant to log in or sign up
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // console.log("Form changed, e : " + e);
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert("Please fill in all fields");
      return;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    if (isLogin) {
      fetch("http://localhost:8000/users")
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          const user = data.find(
            (user: any) =>
              user.email === formData.email &&
              user.password === formData.password
          );
          if (user) {
            login(user);
            navigate("/");
          } else {
            alert("Invalid email or password");
          }
        });
    } else {
      fetch("http://localhost:8000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })
        .then((response) => response.json())
        .then(() => {
          alert("Registration successful");
        })
        .catch((error) => {
          console.error("Error during registration:", error);
          alert("Registration failed");
        });
    }
  };

  return (
    <>
      <div className="flex justify-center mb-4">
        <button
          type="button"
          onClick={() => setIsLogin(true)}
          className={`px-4 py-2 font-semibold transition-all duration-300 ease-in-out ${
            isLogin
              ? "bg-blue-500 text-white dark:text-black"
              : "bg-gray-200 dark:bg-gray-600 dark:text-gray-200 "
          }`}
        >
          Log In
        </button>
        <button
          type="button"
          onClick={() => setIsLogin(false)}
          className={`px-4 py-2 font-semibold transition-all duration-300 ease-in-out ${
            !isLogin
              ? "bg-blue-500 text-white dark:text-black"
              : "bg-gray-200 dark:bg-gray-600 dark:text-gray-200 "
          }`}
        >
          Sign Up
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 ">
        <input
          id="email"
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-2 border rounded dark:border-white dark:text-white"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          id="password"
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-2 border rounded dark:border-white dark:text-white"
          value={formData.password}
          onChange={handleChange}
          required
        />
        {!isLogin && (
          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="w-full p-2 border rounded dark:border-white dark:text-white"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        )}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          {isLogin ? "Login" : "Register"}
        </button>
      </form>
    </>
  );
};

export default AuthForm;
