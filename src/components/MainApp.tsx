import React, { ReactNode } from 'react';
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
import { CreateAssetComponent } from './admin/asset/CreateAssetComponent';
import { EditAssetComponent } from './admin/asset/EditAssetComponent';
import { CreateAssignmentComponent } from './admin/assignment/CreateAssignmentComponent';
import { EditAssignmentComponent } from './admin/assignment/EditAssignmentComponent';

export const MainApp: React.FC<{ setHeaderTitle: (title: ReactNode) => void, roleId: number }> = ({ setHeaderTitle, roleId }) => {

    return (
        <div className="d-flex flex-column flex-md-row mx-4 mt-5" style={{ minWidth: '20vw' }}>
            <aside className="sidebar-column col-12 col-md-3 col-lg-2 px-2" style={{ position: 'sticky', top: 0 }}>
                <SidebarComponent setHeaderTitle={setHeaderTitle} roleId={roleId} />
            </aside> 
            <main className="main-column col-12 col-md-9 col-lg-10" style={{ flexFlow: 'column', height: '100%' }}>
                <Routes>
                    {roleId === 1 ? (
                        <Route element={<PermissionCheck allowedRoles={[1]} userRole={roleId} />}>
                            <Route path="home" element={<AdminHomeComponent setHeaderTitle={setHeaderTitle} />} />
                            <Route path="manage-users" element={<ManageUserComponent setHeaderTitle={setHeaderTitle} />} />
                            <Route path="manage-users/new" element={<CreateUserComponent setHeaderTitle={setHeaderTitle} />} />
                            <Route path="manage-users/edit" element={<EditUserComponent setHeaderTitle={setHeaderTitle} />} />
                            <Route path="manage-assets" element={<ManageAssetComponent setHeaderTitle={setHeaderTitle} />} />
                            <Route path="manage-assets/new" element={<CreateAssetComponent setHeaderTitle={setHeaderTitle} />} />
                            <Route path="manage-assets/edit" element={<EditAssetComponent setHeaderTitle={setHeaderTitle} />} />
                            <Route path="manage-assignments" element={<ManageAssignmentComponent setHeaderTitle={setHeaderTitle} />} />
                            <Route path="manage-assignments/new" element={<CreateAssignmentComponent setHeaderTitle={setHeaderTitle} />} />
                            <Route path="manage-assignments/edit" element={<EditAssignmentComponent setHeaderTitle={setHeaderTitle} />} />
                            <Route path="request-returning" element={<RequestReturningConponent setHeaderTitle={setHeaderTitle} />} />
                            <Route path="reports" element={<ReportComponent setHeaderTitle={setHeaderTitle} />} />
                            <Route path="*" element={<Navigate to={'/admin/home'} />} />
                        </Route>
                    ) : (
                        <Route element={<PermissionCheck allowedRoles={[2]} userRole={roleId} />}>
                            <Route path="home" element={<UserHomeComponent setHeaderTitle={setHeaderTitle} />} />
                            <Route path="*" element={<Navigate to={'/user/home'} />} />
                        </Route>
                    )}
                </Routes>
            </main>
        </div>
    );
}
