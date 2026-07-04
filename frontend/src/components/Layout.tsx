import Sidebar from './Sidebar';
import Header from './Header';
import { Outlet } from 'react-router-dom';

function Layout() {

  const role = localStorage.getItem('role') || "Guest";
  
  return (
    <div className="flex bg-gray-50 overflow-hidden h-screen">
        {role !== 'Guest' && <Sidebar />}
        <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto">
                <Outlet />
            </main>
        </div> 
    </div>
  );
}

export default Layout;