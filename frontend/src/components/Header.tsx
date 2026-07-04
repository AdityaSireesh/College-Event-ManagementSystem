import { useNavigate } from 'react-router-dom';

function Header() {

  const navigate = useNavigate();
  const username = localStorage.getItem('username') || "Guest";

  const handleLogout = () => {
    localStorage.clear(); 
    navigate('/'); 
  };
  
  return (
    <header className="flex justify-between items-center bg-white px-8 py-4 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800">
        Welcome, {username}!
      </h2>

      <button 
        onClick={handleLogout}
        className="px-5 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-400 transition duration-300"
      >
        Logout
      </button>
    </header>
  )
}

export default Header