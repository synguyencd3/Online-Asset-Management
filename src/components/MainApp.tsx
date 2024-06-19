import React, { useEffect } from 'react'
import { SidebarComponent } from './commons/SideBarComponent';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { ManageAssetComponent } from './admin/asset/ManageAssetComponent';
import { ManageAssignmentComponent } from './admin/assignment/ManageAssignmentComponent';
import { AdminHomeComponent } from './admin/home/AdminHomeComponent';
import { ReportComponent } from './admin/report/ReportComponent';
import { RequestReturningConponent } from './admin/returning/RequestReturningConponent';
import { ManageUserComponent } from './admin/user/ManageUserComponent';
import { PermissionCheck } from './auth/PermissionCheckComponent';
import { CreateUserComponent } from './admin/user/CreateUserComponent';
import { EditUserComponent } from './admin/user/EditUserComponent';

export const MainApp: React.FC<{ setHeaderTitle: (title: string) => void }> = ({ setHeaderTitle }) => {
    const navigate = useNavigate();

    useEffect(() => {
        setHeaderTitle('Home');
    }, [setHeaderTitle]);

    return (
        <div className="d-flex mx-5 mt-5">
            <SidebarComponent setHeaderTitle={setHeaderTitle} />
            <main className="container" style={{ flexFlow: 'column', height: '100%' }}>
                <Routes>
                    <Route element={<PermissionCheck />}>
                        <Route path="home" element={<AdminHomeComponent />} />
                        <Route path="manage-users" element={<ManageUserComponent url={'http://localhost:8080/api/v1/'} />} />
                        <Route path="manage-users/new" element={<CreateUserComponent url={'http://localhost:8080/api/v1/'} />} />
                        <Route path="manage-users/edit" element={<EditUserComponent url={'http://localhost:8080/api/v1/'} />} />
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
