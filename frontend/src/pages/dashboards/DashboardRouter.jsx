import React from 'react';
import { useAuthStore } from '../../store/authStore';
import AdminDashboard from './AdminDashboard';
import ManagerDashboard from './ManagerDashboard';
import TechnicianDashboard from './TechnicianDashboard';
import EmployeeDashboard from './EmployeeDashboard';
import AssetManagerDashboard from './AssetManagerDashboard';

export default function DashboardRouter() {
  const { user } = useAuthStore();

  switch (user?.role) {
    case 'System Admin':
      return <AdminDashboard />;
    case 'IT Manager':
      return <ManagerDashboard />;
    case 'Technician':
      return <TechnicianDashboard />;
    case 'Employee':
      return <EmployeeDashboard />;
    case 'Asset Manager':
      return <AssetManagerDashboard />;
    default:
      return <EmployeeDashboard />;
  }
}

