import { useState, useEffect } from 'react';
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, useLocation, BrowserRouter } from 'react-router-dom';

import "./index.css";
import { UserProvider } from './Providers/UserProvider';
import Dashboard from './pages/dashboard/Dashboard';
import UserSignin from './pages/signin-signup/UserSignin';
import AdminSignin from './pages/signin-signup/AdminSignin';
import UserRegistration from './pages/signin-signup/UserRegistration';
import AdminConfirmEmail from './pages/signin-signup/AdminConfirmEmail';
import UserManagement from './pages/user-management/UserManagement';
import ConfirmUser from './pages/confirm-user/ConfirmUser';
import NewUserResetPassword from './pages/new-user/NewUserResetPassword';
import AdminSignup from './pages/signin-signup/AdminSignup';
import ServerOfflinePage from './pages/server-offline/ServerOffline';
import { AuthProvider } from './Providers/AuthProvider';
import Accounts from './pages/accounts/accounts';

import { Layout } from './components/layout/layout';
import { SystemsProvider } from './Providers/SystemsProvider';
import AccountsProvider from './Providers/AccountsProvider';
import { HttpProvider } from './Providers/HttpProvider';

const apiUrl = 'http://localhost:7071/api/v1'


  // This component will determine whether to show the Navbar

  const rootElement = document.getElementById('root');
  if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <HttpProvider apiUrl={apiUrl}>
          <SystemsProvider apiUrl={apiUrl}>
            <AuthProvider apiUrl={apiUrl}>
            <UserProvider apiUrl={apiUrl}>
              <AccountsProvider apiUrl={apiUrl}>
                <BrowserRouter>
                  <Layout>
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
                  </Layout>
                </BrowserRouter>
              </AccountsProvider>
            </UserProvider>
            </AuthProvider>
          </SystemsProvider>
        </HttpProvider>
      </React.StrictMode>
    );
  }
    
