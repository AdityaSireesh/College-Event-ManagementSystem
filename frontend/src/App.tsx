import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import axios from 'axios'
import Start from './components/Start'
import Login from './components/Login'
import ForgotPassword from './components/ForgotPassword.tsx'
import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import AddEvent from './components/AddEvent'
import UpdateEvent from './components/UpdateEvent'
import UpdatePastEvent from './components/UpdatePastEvent'
import UpdateActiveEvent from './components/UpdateActiveEvent.tsx'
import SocHandle from './components/SocHandle'
import AdminHandle from './components/AdminHandle.tsx'
import ActiveEvent from './components/ActiveEvent'
import PastEvent from './components/PastEvent'

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRedirecting = false;

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {

      if (!isRedirecting) {
        isRedirecting = true;
      
        localStorage.clear();
        
        alert("Your session has expired or your account was removed. Please log in again.");
        
        window.location.href = '/';
      }
    }
    
    return Promise.reject(error);
  }
);

function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    const scrollContainer = document.querySelector('main');
    if (scrollContainer) {
      scrollContainer.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}

function App() {
  
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />}/>
          <Route path="/updateevent" element={<UpdateEvent />}/>
          <Route path="/addevent" element={<AddEvent />}/>
          <Route path="/updatepastevent" element={<UpdatePastEvent />}/>
          <Route path="/updateactiveevent" element={<UpdateActiveEvent />}/>
          <Route path="/sochandle" element={<SocHandle />}/>
          <Route path="/adminhandle" element={<AdminHandle />}/>
          <Route path="/activeevent/:id" element={<ActiveEvent />}/>
          <Route path="/pastevent/:id" element={<PastEvent />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App