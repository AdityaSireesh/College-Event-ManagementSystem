import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import Addons from "./Addons";

function Login() {
  const { showFlash, UIOverlay } = Addons();

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        username: name,
        password: password,
        role: role
      });

      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', response.data.username);
        localStorage.setItem('UserId', response.data.UserId);
        
        navigate('/dashboard'); 
      }
      else {
        showFlash(response.data.msg, 'error')
      }
    }
    catch (error: any) {
      const errorMsg = error.response?.data?.msg || "Failed to connect to the server.";
      showFlash(errorMsg, 'error');
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <div className="flex flex-col items-center bg-gray-50 pt-12 min-h-screen">
      <UIOverlay />
      
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        {role} Login
      </h1>

      <form 
        onSubmit={handleLoginSubmit}
        className="flex flex-col bg-white p-10 mt-2 rounded-lg shadow-md w-120 border border-gray-200"
      >
        <label className="mb-2 text-m font-semibold">Username</label>
        <input 
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mb-4 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        <label className="mb-2 text-m font-semibold">Password</label>
        <input 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mb-6 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        <button 
          type="submit" 
          className="px-6 py-2 mx-10 mt-2 bg-purple-500 text-white font-semibold rounded hover:bg-purple-600 transition duration-300"
        >
          Sign In
        </button>

        <button 
          type="button"
          onClick={handleForgotPassword}
          className="mt-6 text-sm text-purple-600 hover:text-purple-800 hover:underline self-center"
        >
          Forgot your password?
        </button>
      </form>
    </div>
  );
}

export default Login;