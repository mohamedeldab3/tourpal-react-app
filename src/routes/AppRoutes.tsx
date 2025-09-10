import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import Home from '../pages/home/Home';
import Search from '../pages/search/Search';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import CarDetail from '../pages/car/CarDetail';
import UserDashboard from '../pages/dashboard/UserDashboard';
import ProviderDashboard from '../pages/dashboard/ProviderDashboard';
import AdminDashboard from '../pages/dashboard/AdminDashboard';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes using MainLayout */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="search" element={<Search />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="car/:id" element={<CarDetail />} />
      </Route>

      {/* Protected Dashboard Routes using DashboardLayout */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="user" element={<UserDashboard />} />
        <Route path="provider" element={<ProviderDashboard />} />
        <Route path="admin" element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;

