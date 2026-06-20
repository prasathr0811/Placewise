import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Protected from './components/Protected';

// Layout components
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Predict from './pages/Predict';
import Results from './pages/Results';
import SkillGap from './pages/SkillGap';
import CareerRecs from './pages/CareerRecs';
import Profile from './pages/Profile';

// App Layout wrapper for protected routes
const AppLayout = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#030712] flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 pl-64 flex flex-col min-h-screen">
        {/* Navbar */}
        <Navbar />

        {/* Dynamic page contents */}
        <main className="flex-1 px-8 pt-28 pb-12 overflow-y-auto">
          <Outlet />
          <Footer />
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Dashboard Routes */}
            <Route element={<Protected><AppLayout /></Protected>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/predict" element={<Predict />} />
              <Route path="/results" element={<Results />} />
              <Route path="/skill-gap" element={<SkillGap />} />
              <Route path="/careers" element={<CareerRecs />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
