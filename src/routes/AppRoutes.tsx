import React, { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import Loadable from '../components/Loadable';
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';

// Lazy load components
const Home = Loadable(lazy(() => import('../pages/home/Home')));
const Search = Loadable(lazy(() => import('../pages/search/Search')));
const Login = Loadable(lazy(() => import('../pages/auth/Login')));
const Register = Loadable(lazy(() => import('../pages/auth/Register')));
const RegisterStep2 = Loadable(lazy(() => import('../pages/auth/RegisterStep2')));
const ForgotPassword = Loadable(lazy(() => import('../pages/auth/ForgotPassword')));
const ResetPassword = Loadable(lazy(() => import('../pages/auth/ResetPassword')));
const ConfirmEmail = Loadable(lazy(() => import('../pages/auth/ConfirmEmail')));
const PleaseConfirm = Loadable(lazy(() => import('../pages/auth/PleaseConfirm')));
const CarDetail = Loadable(lazy(() => import('../pages/car/CarDetail')));
const UserDashboard = Loadable(lazy(() => import('../pages/dashboard/UserDashboard')));
const ProviderDashboard = Loadable(lazy(() => import('../pages/dashboard/ProviderDashboard')));
const AdminDashboard = Loadable(lazy(() => import('../pages/dashboard/AdminDashboard')));
const ClientDashboard = Loadable(lazy(() => import('../pages/dashboard/ClientDashboard')));
const Profile = Loadable(lazy(() => import('../pages/dashboard/Profile')));
const TourGuideSearch = Loadable(lazy(() => import('../pages/tour-guide/TourGuideSearch')));
const TourGuideDetail = Loadable(lazy(() => import('../pages/tour-guide/TourGuideDetail')));
const CreateAdvertisement = Loadable(lazy(() => import('../pages/dashboard/CreateAdvertisement')));

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
        <Route path="user" element={<ProtectedRoute allowedRoles={['user']}><UserDashboard /></ProtectedRoute>} />
        <Route path="provider" element={<ProtectedRoute allowedRoles={['provider']}><ProviderDashboard /></ProtectedRoute>} />
        <Route path="admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="client" element={<ProtectedRoute allowedRoles={['user']}><ClientDashboard /></ProtectedRoute>} /> {/* New Client Dashboard Route */}
        <Route path="profile" element={<Profile />} />
        <Route path="create-ad" element={<ProtectedRoute allowedRoles={['user', 'provider']}><CreateAdvertisement /></ProtectedRoute>} /> {/* إضافة المسار الجديد */}
      </Route>
    </Routes>
  );
};

export default AppRoutes;
