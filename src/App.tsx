import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HeaderComponent } from './components/commons/HeaderComponent';
import { AdminHomeComponent } from './components/admin/home/AdminHomeComponent';
import { ManageUserComponent } from './components/admin/user/ManageUserComponent';
import { ManageAssetComponent } from './components/admin/asset/ManageAssetComponent';
import { ManageAssignmentComponent } from './components/admin/assignment/ManageAssignmentComponent';
import { RequestReturningConponent } from './components/admin/returning/RequestReturningConponent';
import { ReportComponent } from './components/admin/report/ReportComponent';
import { SidebarComponent } from './components/commons/SidebarComponent';
import { PermissionCheck } from './components/auth/PermissionCheck';

function App() {
  const [headerTitle, setHeaderTitle] = useState<string>('HOME');

  return (
    <Router>
      <div style={{ flexFlow: 'column', height: '100%' }}>
        <HeaderComponent title={headerTitle} />
        <div className="d-flex container-fluid mt-5">
          <SidebarComponent setHeaderTitle={setHeaderTitle} />
          <main className="container-fluid" style={{ flexFlow: 'column', height: '100%' }}>
            <Routes>
              <Route element={<PermissionCheck />}>
                <Route path="/admin/home" element={<AdminHomeComponent />} />
                <Route path="/admin/manage-users" element={<ManageUserComponent />} />
                <Route path="/admin/manage-assets" element={<ManageAssetComponent />} />
                <Route path="/admin/manage-assignments" element={<ManageAssignmentComponent />} />
                <Route path="/admin/request-returning" element={<RequestReturningConponent />} />
                <Route path="/admin/reports" element={<ReportComponent />} />
              </Route>
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
