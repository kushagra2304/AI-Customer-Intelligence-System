import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/dashboard/Sidebar';
import OverviewPage from './pages/OverviewPage';
import QueriesPage from './pages/QueriesPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AutomationPage from './pages/AutomationPage';
import ClassifyPage from './pages/ClassifyPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-beast-bg">
        <Sidebar />
        <main className="ml-56 flex-1 p-6 min-h-screen">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/"           element={<OverviewPage />}    />
              <Route path="/queries"    element={<QueriesPage />}     />
              <Route path="/analytics"  element={<AnalyticsPage />}   />
              <Route path="/automation" element={<AutomationPage />}  />
              <Route path="/classify"   element={<ClassifyPage />}    />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}
