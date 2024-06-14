import React, { useEffect } from 'react'
import { SidebarComponent } from './commons/SideBarComponent';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { ManageAssetComponent } from './admin/asset/ManageAssetComponent';
import { ManageAssignmentComponent } from './admin/assignment/ManageAssignmentComponent';
import { AdminHomeComponent } from './admin/home/AdminHomeComponent';
import { ReportComponent } from './admin/report/ReportComponent';
import { RequestReturningConponent } from './admin/returning/RequestReturningConponent';
import { ManageUserComponent } from './admin/user/ManageUserComponent';
import { PermissionCheck } from './auth/PermissionCheck';

export const MainApp: React.FC<{ setHeaderTitle: (title: string) => void }> = ({ setHeaderTitle }) => {
    const navigate = useNavigate();

    useEffect(() => {
        setHeaderTitle('HOME');
        navigate('/admin/home');
    }, [navigate, setHeaderTitle]);

    return (
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
    );
}
