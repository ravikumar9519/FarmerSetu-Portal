import { useContext } from 'react';
import { SellerContext } from './context/SellerContext';
import { AdminContext } from './context/AdminContext';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

import Dashboard from './pages/Admin/Dashboard';
import AllAppointments from './pages/Admin/AllAppointments';
import AddSeller from './pages/Admin/AddSeller';
import SellerList from './pages/Admin/SellerList';
import SellerProfileAdmin from './pages/Admin/SellerProfile'; // ✅ Admin can view/edit Seller

import BuyerList from './pages/Admin/BuyerList';
import BuyerProfile from './pages/Admin/BuyerProfile';

import SellerDashboard from './pages/Seller/SellerDashboard';
import SellerAppointments from './pages/Seller/SellerAppointments';
import SellerProfile from './pages/Seller/SellerProfile'; // ✅ Seller's own profile

import Login from './pages/Login';

const App = () => {
  const { dToken } = useContext(SellerContext);
  const { aToken } = useContext(AdminContext);

  const HomeRedirect = () => {
    if (aToken) return <Navigate to="/admin-dashboard" />;
    if (dToken) return <Navigate to="/seller-dashboard" />;
    return <Navigate to="/login" />;
  };

  return dToken || aToken ? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer />
      <Navbar />
      <div className='flex items-start'>
        <Sidebar />
        <Routes>
          <Route path='/' element={<HomeRedirect />} />
          {/* Admin Routes */}
          <Route path='/admin-dashboard' element={<Dashboard />} />
          <Route path='/all-appointments' element={<AllAppointments />} />
          <Route path='/add-seller' element={<AddSeller />} />
          <Route path='/seller-list' element={<SellerList />} />
          <Route path='/admin/seller-profile/:id' element={<SellerProfileAdmin />} />
          <Route path='/admin/all-buyers' element={<BuyerList />} />
          <Route path='/admin/buyer-profile/:id' element={<BuyerProfile />} />

          {/* Seller Routes */}
          <Route path='/seller-dashboard' element={<SellerDashboard />} />
          <Route path='/seller-appointments' element={<SellerAppointments />} />
          <Route path='/seller-profile' element={<SellerProfile />} />
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <ToastContainer />
      <Login />
    </>
  );
};

export default App;
