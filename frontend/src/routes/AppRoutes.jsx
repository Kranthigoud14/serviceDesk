import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';
import PublicOnlyRoute from './PublicOnlyRoute';
import AppLayout from '../components/layout/AppLayout';

// Pages
import LandingPage from '../pages/landing/LandingPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import DashboardRouter from '../pages/dashboards/DashboardRouter';
import AdminDashboard from '../pages/dashboards/AdminDashboard';
import ManagerDashboard from '../pages/dashboards/ManagerDashboard';
import TechnicianDashboard from '../pages/dashboards/TechnicianDashboard';
import EmployeeDashboard from '../pages/dashboards/EmployeeDashboard';
import AssetManagerDashboard from '../pages/dashboards/AssetManagerDashboard';
import TicketsListPage from '../pages/tickets/TicketsListPage';
import CreateTicketPage from '../pages/tickets/CreateTicketPage';
import TicketDetailsPage from '../pages/tickets/TicketDetailsPage';
import TechniciansPage from '../pages/technicians/TechniciansPage';
import TechnicianDetailPage from '../pages/technicians/TechnicianDetailPage';
import WorkforcePage from '../pages/workforce/WorkforcePage';
import AssetsPage from '../pages/assets/AssetsPage';
import AssetDetailPage from '../pages/assets/AssetDetailPage';
import UsersPage from '../pages/users/UsersPage';
import KnowledgeBasePage from '../pages/knowledge/KnowledgeBasePage';
import AnalyticsPage from '../pages/analytics/AnalyticsPage';
import AuditLogsPage from '../pages/audit/AuditLogsPage';
import ProfilePage from '../pages/profile/ProfilePage';
import NotificationsPage from '../pages/notifications/NotificationsPage';
import NotFoundPage from '../pages/NotFoundPage';
import { useAuthStore } from '../store/authStore';

function RootRoute() {
  const { isAuthenticated, isLoading } = useAuthStore();
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-400 font-mono">Initializing ServiceDesk Pro...</p>
      </div>
    );
  }
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return <LandingPage />;
}

function TechnicianSelfRedirect() {
  const { user } = useAuthStore();
  return <Navigate to={`/technicians/${user?.id || 'me'}`} replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<RootRoute />} />
      <Route path="/home" element={<RootRoute />} />

      {/* Public Auth Routes */}
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <RegisterPage />
          </PublicOnlyRoute>
        }
      />

      {/* Protected App Layout */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        {/* Dynamic & Explicit Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardRouter />} />
        <Route
          path="/admin/dashboard"
          element={
            <RoleRoute allowedRoles={['System Admin']}>
              <AdminDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/manager/dashboard"
          element={
            <RoleRoute allowedRoles={['IT Manager']}>
              <ManagerDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/technician/dashboard"
          element={
            <RoleRoute allowedRoles={['Technician']}>
              <TechnicianDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/employee/dashboard"
          element={
            <RoleRoute allowedRoles={['Employee']}>
              <EmployeeDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/asset-manager/dashboard"
          element={
            <RoleRoute allowedRoles={['Asset Manager']}>
              <AssetManagerDashboard />
            </RoleRoute>
          }
        />

        {/* Tickets */}
        <Route path="/tickets" element={<TicketsListPage />} />
        <Route path="/tickets/new" element={<CreateTicketPage />} />
        <Route path="/tickets/:id" element={<TicketDetailsPage />} />

        {/* Knowledge Base */}
        <Route path="/knowledge-base" element={<KnowledgeBasePage />} />

        {/* Dedicated Analytics */}
        <Route
          path="/analytics"
          element={
            <RoleRoute allowedRoles={['System Admin', 'IT Manager', 'Asset Manager']}>
              <AnalyticsPage />
            </RoleRoute>
          }
        />

        {/* Audit Logs */}
        <Route
          path="/audit-logs"
          element={
            <RoleRoute allowedRoles={['System Admin']}>
              <AuditLogsPage />
            </RoleRoute>
          }
        />

        {/* Technicians */}
        <Route
          path="/technicians"
          element={
            <RoleRoute allowedRoles={['IT Manager']}>
              <TechniciansPage />
            </RoleRoute>
          }
        />
        <Route
          path="/technicians/:id"
          element={
            <RoleRoute allowedRoles={['IT Manager', 'Technician']}>
              <TechnicianDetailPage />
            </RoleRoute>
          }
        />
        <Route
          path="/technicians/me/skills"
          element={
            <RoleRoute allowedRoles={['Technician']}>
              <TechnicianSelfRedirect />
            </RoleRoute>
          }
        />
        <Route
          path="/technicians/me/availability"
          element={
            <RoleRoute allowedRoles={['Technician']}>
              <TechnicianSelfRedirect />
            </RoleRoute>
          }
        />

        {/* Workforce Intelligence */}
        <Route
          path="/workforce"
          element={
            <RoleRoute allowedRoles={['IT Manager']}>
              <WorkforcePage />
            </RoleRoute>
          }
        />

        {/* Assets */}
        <Route path="/assets" element={<AssetsPage />} />
        <Route path="/assets/:id" element={<AssetDetailPage />} />

        {/* Users */}
        <Route
          path="/users"
          element={
            <RoleRoute allowedRoles={['System Admin', 'IT Manager']}>
              <UsersPage />
            </RoleRoute>
          }
        />

        {/* Profile & Notifications */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

