import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { BusinessDashboard } from './pages/BusinessDashboard';
import { ClientBooking } from './pages/ClientBooking';
import { BusinessSettings } from './pages/BusinessSettings';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/business"
            element={
              <ProtectedRoute>
                <BusinessDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/business/settings"
            element={
              <ProtectedRoute>
                <BusinessSettings />
              </ProtectedRoute>
            }
          />
          <Route path="/book" element={<ClientBooking />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Appointment Scheduler
          </h1>
          <p className="text-gray-600">
            Google Calendar-style booking system for small businesses
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to="/business"
            className="block w-full px-6 py-4 bg-google-blue text-white text-center rounded-lg hover:bg-blue-600 transition-colors"
          >
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="font-semibold">Business Dashboard</span>
            </div>
            <p className="text-sm text-blue-100 mt-1">
              Manage appointments and view your calendar
            </p>
          </Link>

          <Link
            to="/book"
            className="block w-full px-6 py-4 bg-white border-2 border-gray-300 text-gray-900 text-center rounded-lg hover:border-google-blue hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-semibold">Book Appointment</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Schedule your service appointment
            </p>
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h2 className="text-sm font-semibold text-gray-900 mb-2">Features:</h2>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Google Calendar-style interface</li>
            <li>• Month, Week, and Day views</li>
            <li>• Real-time availability checking</li>
            <li>• Service and staff management</li>
            <li>• Client booking flow</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
