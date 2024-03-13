import { useState, useEffect } from 'react';
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, useLocation, BrowserRouter } from 'react-router-dom';
import './App.css';
import { UserProvider } from './util/UserProvider';
import Navbar from './components/navbar/navbar';
import Dashboard from './pages/dashboard/Dashboard';
import UserSignin from './pages/signin-signup/UserSignin';
import AdminSignin from './pages/signin-signup/AdminSignin';
import UserRegistration from './pages/signin-signup/UserRegistration';
import AdminConfirmEmail from './pages/signin-signup/AdminConfirmEmail';
import UserManagement from './pages/user-management/user-management';
import ConfirmUser from './pages/confirm-user/ConfirmUser';
import NewUserResetPassword from './pages/new-user/NewUserResetPassword';
import AdminSignup from './pages/signin-signup/AdminSignup';
import ServerOfflinePage from './pages/server-offline/ServerOffline';
import { AuthProvider } from './util/AuthProvider';
import Accounts from './pages/accounts/accounts';

import { Layout } from './components/layout/layout';
import { SystemsProvider } from './util/SystemsProvider';

function App() {
  // This component will determine whether to show the Navbar

  const rootElement = document.getElementById('root');
  if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <SystemsProvider>
          <AuthProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/user-signin" element={<UserSignin />} />
                <Route path="/admin-signin" element={<AdminSignin />} />
                <Route path="/admin-signup" element={<AdminSignup />} />
                <Route path="/user-registration" element={<UserRegistration />} />
                <Route path="/admin-confirm-email" element={<AdminConfirmEmail />} />
                <Route path="/confirm-user" element={<ConfirmUser />} />
                <Route path="/new-user/reset-password" element={<NewUserResetPassword />} />
                <Route path="/user-management" element={<UserManagement />} />
                <Route path="/accounts" element={<Accounts />} /> 
                <Route path="/server-offline" element={<ServerOfflinePage />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </SystemsProvider>
      </React.StrictMode>
    );
  }
    
}