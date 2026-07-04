import { useNavigate } from "react-router-dom";

function Start() { 
  const navigate = useNavigate();

  const toLogin = (role: string) => {
    localStorage.setItem('role', role);
    navigate('/login');
  };

  const toDashboard = () => {
    localStorage.setItem('role', 'Guest');
    navigate('/dashboard');
  };

  return (
    <div className="flex flex-col items-center pt-10 bg-gray-50">
      
      <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center pb-40">
        Welcome to Baselios Event Manager
      </h1>

      <div className="flex space-x-20">
        <button 
        onClick={toDashboard} 
        className="px-6 py-3 w-50 h-50 bg-purple-400 text-white font-semibold text-3xl rounded-lg shadow-md hover:bg-purple-500 transition duration-300"
        >
          Guest
        </button>
        <button 
          onClick={() => toLogin('SoC')} 
          className="px-6 py-3 w-50 h-50 bg-purple-400 text-white font-semibold text-3xl rounded-lg shadow-md hover:bg-purple-500 transition duration-300"
        >
          SoC
        </button>
        <button 
          onClick={() => toLogin('Admin')} 
          className="px-6 py-3 w-50 h-50 bg-purple-400 text-white font-semibold text-3xl rounded-lg shadow-md hover:bg-purple-500 transition duration-300"
        >
          Admin
        </button>
      </div>
    </div>
  );
}

export default Start
