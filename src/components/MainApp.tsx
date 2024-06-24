import React, { useEffect } from 'react';
import { SidebarComponent } from './commons/SideBarComponent';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ManageAssetComponent } from './admin/asset/ManageAssetComponent';
import { ManageAssignmentComponent } from './admin/assignment/ManageAssignmentComponent';
import { AdminHomeComponent } from './admin/home/AdminHomeComponent';
import { ReportComponent } from './admin/report/ReportComponent';
import { RequestReturningConponent } from './admin/returning/RequestReturningConponent';
import { ManageUserComponent } from './admin/user/ManageUserComponent';
import { PermissionCheck } from './auth/PermissionCheckComponent';
import { CreateUserComponent } from './admin/user/CreateUserComponent';
import { EditUserComponent } from './admin/user/EditUserComponent';
import { UserHomeComponent } from './user/UserHomeComponent';

export const MainApp: React.FC<{ setHeaderTitle: (title: string) => void, roleId: number }> = ({ setHeaderTitle, roleId }) => {
    useEffect(() => {
        setHeaderTitle('Home');
    }, [setHeaderTitle]);

    return (
        <div className="d-flex flex-column flex-md-row mx-4 mt-5" style={{ minWidth: '20vw' }}>
            <aside className="sidebar-column col-12 col-md-3 col-lg-2 px-2">
                <SidebarComponent setHeaderTitle={setHeaderTitle} roleId={roleId} />
            </aside>
            <main className="main-column col-12 col-md-9 col-lg-10" style={{ flexFlow: 'column', height: '100%' }}>
                <Routes>
                    {roleId === 1 ? (
                        <Route element={<PermissionCheck allowedRoles={[1]} userRole={roleId} />}>
                            <Route path="home" element={<AdminHomeComponent />} />
                            <Route path="manage-users" element={<ManageUserComponent />} />
                            <Route path="manage-users/new" element={<CreateUserComponent />} />
                            <Route path="manage-users/edit" element={<EditUserComponent />} />
                            <Route path="manage-assets" element={<ManageAssetComponent />} />
                            <Route path="manage-assignments" element={<ManageAssignmentComponent />} />
                            <Route path="request-returning" element={<RequestReturningConponent />} />
                            <Route path="reports" element={<ReportComponent />} />
                            <Route path="*" element={<Navigate to={'/admin/home'} />} />
                        </Route>
                    ) : (
                        <Route element={<PermissionCheck allowedRoles={[2]} userRole={roleId} />}>
                            <Route path="home" element={<UserHomeComponent />} />
                            <Route path="*" element={<Navigate to={'/user/home'} />} />
                        </Route>
                    )}
                </Routes>
            </main>
        </div>
    );
}
