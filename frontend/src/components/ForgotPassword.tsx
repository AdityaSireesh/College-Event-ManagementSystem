import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Addons from "./Addons";

function ForgotPassword() {
  const { setIsLoading, showFlash, UIOverlay } = Addons();

  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  const [step, setStep] = useState(1);
  
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/auth/send-otp', { email, role });
      showFlash(response.data.msg, 'success');
      setStep(2);
    }
    catch (error: any) {
      showFlash(error.response?.data?.msg || "Failed to connect to the server.", 'error');
    }
    finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/auth/verify-otp', { email, otp, role });
      setStep(3);
    }
    catch (error: any) {
      showFlash(error.response?.data?.msg || "Failed to connect to the server.", 'error');
    }
    finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showFlash("Passwords do not match!", 'error');
      return;
    }

    try {
      await axios.post('http://localhost:3000/auth/set-password', { 
        email, 
        password: newPassword, 
        role 
      });
      
      showFlash("Password reset successfully! Redirecting to login page...", 'success');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
    catch (error: any) {
      showFlash(error.response?.data?.msg || "Failed to connect to the server.", 'error');
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-50 pt-12 min-h-screen">
      <UIOverlay />
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        {role} Password Reset
      </h1>

      <div className="bg-white p-10 mt-2 rounded-lg shadow-md w-120 border border-gray-200">
        
        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="flex flex-col">
            <p className="text-sm text-gray-600 mb-6 text-center">
              Enter your registered email address. We will send you an OTP to reset your password.
            </p>
            <label className="mb-2 text-m font-semibold">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mb-6 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button type="submit" className="px-6 py-2 bg-purple-500 text-white font-semibold rounded hover:bg-purple-600 transition duration-300">
              Send OTP
            </button>
            <button type="button" onClick={() => navigate(-1)} className="mt-6 text-sm text-gray-500 hover:text-gray-800 hover:underline self-center">
              Cancel and Return to Login
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleOtpSubmit} className="flex flex-col">
            <p className="text-sm text-gray-600 mb-6 text-center">
              An OTP has been sent to <span className="font-semibold text-gray-800">{email}</span>. Please enter it below.
            </p>
            <label className="mb-2 text-m font-semibold">Enter OTP</label>
            <input 
              type="text" 
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              placeholder="e.g. 123456"
              className="mb-6 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400 text-center tracking-widest text-lg"
            />
            <button type="submit" className="px-6 py-2 bg-purple-500 text-white font-semibold rounded hover:bg-purple-600 transition duration-300">
              Verify OTP
            </button>
            <button type="button" onClick={() => setStep(1)} className="mt-6 text-sm text-gray-500 hover:text-gray-800 hover:underline self-center">
              Change Email Address
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handlePasswordSubmit} className="flex flex-col">
            <p className="text-sm text-green-600 font-semibold mb-6 text-center">
              OTP Verified! Please create a new password.
            </p>
            
            <label className="mb-2 text-m font-semibold">New Password</label>
            <input 
              type="password" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="mb-4 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
            />

            <label className="mb-2 text-m font-semibold">Confirm Password</label>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mb-6 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
            />

            <button type="submit" className="px-6 py-2 bg-purple-500 text-white font-semibold rounded hover:bg-purple-600 transition duration-300">
              Save New Password
            </button>
          </form>
        )}

      </div>
    </div>
  );
}

export default ForgotPassword;