import React, { useEffect } from 'react'
import { SidebarComponent } from './commons/SideBarComponent';
import { Routes, Route } from 'react-router-dom';
import { ManageAssetComponent } from './admin/asset/ManageAssetComponent';
import { ManageAssignmentComponent } from './admin/assignment/ManageAssignmentComponent';
import { AdminHomeComponent } from './admin/home/AdminHomeComponent';
import { ReportComponent } from './admin/report/ReportComponent';
import { RequestReturningConponent } from './admin/returning/RequestReturningConponent';
import { ManageUserComponent } from './admin/user/ManageUserComponent';
import { PermissionCheck } from './auth/PermissionCheck';

export const MainApp: React.FC<{ setHeaderTitle: (title: string) => void }> = ({ setHeaderTitle }) => {
    useEffect(() => {
        setHeaderTitle('HOME');
    }, [setHeaderTitle]);

    return (
        <div className="d-flex container-fluid mt-5">
            <SidebarComponent setHeaderTitle={setHeaderTitle} />
            <main className="container-fluid" style={{ flexFlow: 'column', height: '100%' }}>
                <Routes>
                    <Route element={<PermissionCheck />}>
                        <Route path="home" element={<AdminHomeComponent />} />
                        <Route path="manage-users" element={<ManageUserComponent />} />
                        <Route path="manage-assets" element={<ManageAssetComponent />} />
                        <Route path="manage-assignments" element={<ManageAssignmentComponent />} />
                        <Route path="request-returning" element={<RequestReturningConponent />} />
                        <Route path="reports" element={<ReportComponent />} />
                    </Route>
                </Routes>
            </main>
        </div>
    );
}