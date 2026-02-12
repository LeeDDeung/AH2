import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types/auth';

// Placeholder Pages (will be replaced later)
const IntroPage = React.lazy(() => import('../pages/IntroPage'));
const RoleSelectionPage = React.lazy(() => import('../pages/RoleSelectionPage'));
const AppShell = React.lazy(() => import('../components/layout/AppShell'));
// Forms
const PatientForm = React.lazy(() => import('../pages/forms/PatientForm'));
const DoctorForm = React.lazy(() => import('../pages/forms/DoctorForm'));
const PlannerForm = React.lazy(() => import('../pages/forms/PlannerForm'));
// Results
const PatientResult = React.lazy(() => import('../pages/results/PatientResult'));
const DoctorResult = React.lazy(() => import('../pages/results/DoctorResult'));
const PlannerResult = React.lazy(() => import('../pages/results/PlannerResult'));

const AIChatPage = React.lazy(() => import('../pages/AIChatPage'));
const SubscriptionPage = React.lazy(() => import('../pages/SubscriptionPage'));
const GoodbyePage = React.lazy(() => import('../pages/GoodbyePage'));

const ProtectedRoute = ({ allowedRoles }: { allowedRoles: UserRole[] }) => {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    if (user && !allowedRoles.includes(user.role)) {
        // Redirect to their own dashboard or role selection if unauthorized
        return <Navigate to="/role-selection" replace />; // Or safe default
    }

    return <Outlet />;
};

export const AppRoutes = () => {
    return (
        <React.Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<IntroPage />} />
                <Route path="/role-selection" element={<RoleSelectionPage />} />

                {/* Patient Routes */}
                <Route element={<ProtectedRoute allowedRoles={['PATIENT']} />}>
                    <Route path="/patient" element={<AppShell />}>
                        <Route index element={<PatientForm />} />
                        <Route path="result" element={<PatientResult />} />
                        <Route path="chat" element={<AIChatPage />} />
                        <Route path="subscription" element={<SubscriptionPage />} />
                    </Route>
                </Route>

                {/* Doctor Routes */}
                <Route element={<ProtectedRoute allowedRoles={['DOCTOR']} />}>
                    <Route path="/doctor" element={<AppShell />}>
                        <Route index element={<DoctorForm />} />
                        <Route path="result" element={<DoctorResult />} />
                        <Route path="chat" element={<AIChatPage />} />
                    </Route>
                </Route>

                {/* Planner Routes */}
                <Route element={<ProtectedRoute allowedRoles={['PLANNER']} />}>
                    <Route path="/planner" element={<AppShell />}>
                        <Route index element={<PlannerForm />} />
                        <Route path="result" element={<PlannerResult />} />
                        <Route path="chat" element={<AIChatPage />} />
                    </Route>
                </Route>

                {/* Fallback */}
                <Route path="/goodbye" element={<GoodbyePage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </React.Suspense>
    );
};
