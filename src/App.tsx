/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layout
import Layout from './components/layout/Layout';

// Error Boundary
import ErrorBoundary from './components/ErrorBoundary';

// Pages
import Dashboard from './pages/Dashboard';
import CalendarPage from './pages/Calendar';
import ScreeningsPage from './pages/Screenings';
import StatisticsPage from './pages/Statistics';
import TestsPage from './pages/Tests';
import PackagesPage from './pages/PackagesPage';
import ProposalsPage from './pages/ProposalsPage';
import ProposalFormPage from './pages/ProposalFormPage';
import CompaniesPage from './pages/Companies';
import CompaniesFormPage from './pages/CompaniesFormPage';
import PersonnelPage from './pages/Personnel';
import ProfilePage from './pages/Profile';
import SettingsPage from './pages/Settings';
import PackageFormPage from './pages/PackageFormPage';

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="screenings" element={<ScreeningsPage />} />
            <Route path="statistics" element={<StatisticsPage />} />
            <Route path="tests" element={<TestsPage />} />
            <Route path="packages" element={<PackagesPage />} />
            <Route path="tests/package/new" element={<PackageFormPage />} />
            <Route path="proposals" element={<ProposalsPage />} />
            <Route path="proposals/new" element={<ProposalFormPage />} />
            <Route path="companies" element={<CompaniesPage />} />
            <Route path="companies/add" element={<CompaniesFormPage />} />
            <Route path="personnel" element={<PersonnelPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}
