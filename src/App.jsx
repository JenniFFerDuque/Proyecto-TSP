import ProtectedRoute from '@/components/ProtectedRoute';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { SurveyProvider } from '@/contexts/SurveyContext';
import AdminDashboard from '@/pages/AdminDashboard';
import CreateSurvey from '@/pages/CreateSurvey';
import Login from '@/pages/Login';
import Reports from '@/pages/Reports';
import Signup from '@/pages/Signup';
import SurveyDetail from '@/pages/SurveyDetail';
import TakeSurvey from '@/pages/TakeSurvey';
import UserDashboard from '@/pages/UserDashboard';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

function App() {
  return (
    <AuthProvider>
      <SurveyProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/create-survey"
              element={
                <ProtectedRoute requiredRole="admin">
                  <CreateSurvey />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Reports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reports/:id"
              element={
                <ProtectedRoute requiredRole="admin">
                  <SurveyDetail />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requiredRole="user">
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/survey/:id"
              element={
                <ProtectedRoute requiredRole="user">
                  <TakeSurvey />
                </ProtectedRoute>
              }
            />
            
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
          <Toaster />
        </Router>
      </SurveyProvider>
    </AuthProvider>
  );
}

export default App;