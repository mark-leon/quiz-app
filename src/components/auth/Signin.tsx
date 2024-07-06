import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const SignIn: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const history = useNavigate();

  const handleLogin = () => {
    login(username, password);
    if (username === "admin" && password === "admin") {
      history.push("/questions");
    } else if (password === "user") {
      history.push("/answers");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-xs">
        <h2 className="text-center text-2xl mb-4">Sign In</h2>
        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 mb-2 border"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-2 border"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="w-full p-2 bg-blue-500 text-white"
          onClick={handleLogin}
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

export default SignIn;
