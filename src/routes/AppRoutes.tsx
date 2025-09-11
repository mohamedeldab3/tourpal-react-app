import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import Home from '../pages/home/Home';
import Search from '../pages/search/Search';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import RegisterStep2 from '../pages/auth/RegisterStep2';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import ConfirmEmail from '../pages/auth/ConfirmEmail';
import PleaseConfirm from '../pages/auth/PleaseConfirm';
import CarDetail from '../pages/car/CarDetail';
import UserDashboard from '../pages/dashboard/UserDashboard';
import ProviderDashboard from '../pages/dashboard/ProviderDashboard';
import AdminDashboard from '../pages/dashboard/AdminDashboard';
import ProtectedRoute from './ProtectedRoute';
import Profile from '../pages/dashboard/Profile';
import TourGuideSearch from '../pages/tour-guide/TourGuideSearch';
import TourGuideDetail from '../pages/tour-guide/TourGuideDetail';
import CreateAdvertisement from '../pages/dashboard/CreateAdvertisement';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* المسارات العامة */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="search" element={<Search />} />
        
        {/* مسارات دليل المرشدين */}
        <Route path="guides" element={<TourGuideSearch />} />
        <Route path="guide/:id" element={<TourGuideDetail />} />

        <Route path="car/:id" element={<CarDetail />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="register-step2" element={<RegisterStep2 />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="confirm-email" element={<ConfirmEmail />} />
        <Route path="please-confirm" element={<PleaseConfirm />} />
      </Route>

      {/* المسارات المحمية (داشبورد) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Profile />} />
        <Route path="user" element={<UserDashboard />} />
        <Route path="provider" element={<ProviderDashboard />} />
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="create-ad" element={<CreateAdvertisement />} /> {/* إضافة المسار الجديد */}
      </Route>
    </Routes>
  );
};

export default AppRoutes;
