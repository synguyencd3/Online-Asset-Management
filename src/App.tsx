import { ReactNode, useEffect, useState } from 'react';
import './App.css';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { HeaderComponent } from './components/commons/HeaderComponent';
import { LogInComponent } from './components/auth/LogInComponent';
import { MainApp } from './components/MainApp';
import { NotHavePermission } from './components/auth/NotHavePermission';
import { logoSVG } from './utils/ImageFiles';
import { BreadcrumbComponent } from './components/commons/BreadcrumbComponent';

function App() {
    const [headerTitle, setHeaderTitle] = useState<ReactNode>(<BreadcrumbComponent breadcrumb={[{
        title: 'Online Management Asset',
        href: `${window.location.origin}#`
    }]} />);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(Boolean(sessionStorage.getItem('isLoggedIn')) === true);
    const [username, setUsername] = useState('');
    const [roleId, setRoleId] = useState(Number(sessionStorage.getItem('roleId')));

    useEffect(() => {
        setIsLoggedIn(Boolean(sessionStorage.getItem('isLoggedIn')) === true);
        setUsername(sessionStorage.getItem('username') as string);
        setRoleId(Number(sessionStorage.getItem('roleId')));
    }, []);

    const handleGetUsername = (username: string) => {
        setUsername(username);
    }

    const getHomePath = (roleId: number) => {
        return roleId === 1 ? '/admin/home' : '/user/home';
    };

    const handleLogin = (state: boolean, roleId: number) => {
        setIsLoggedIn(state);
        sessionStorage.setItem('isLoggedIn', 'true');
        setRoleId(roleId);
    };

    const handleLogout = (state: boolean, title: string) => {
        if (state) {
            setHeaderTitle(title);
            setIsLoggedIn(false);
            sessionStorage.removeItem('loginResponse');
            sessionStorage.removeItem('isLoggedIn');
            sessionStorage.removeItem('username');
            sessionStorage.removeItem('roleId');
        }
    };


    return (
        <Router>
            <div style={{ flexFlow: 'column', height: '100%' }}>
                <HeaderComponent title={headerTitle} handleLogout={handleLogout} logo={isLoggedIn ? '' : logoSVG} username={username} />
                <Routes>
                    <Route
                        path='/'
                        element={
                            isLoggedIn ? (
                                <Navigate to={getHomePath(roleId)} />
                            ) : (
                                <LogInComponent setIsLoggedIn={handleLogin} setUsername={handleGetUsername} />
                            )
                        }
                    />
                    <Route
                        path='admin/*'
                        element={
                            isLoggedIn && roleId == 1 ? (
                                <MainApp setHeaderTitle={setHeaderTitle} roleId={roleId} />
                            ) : (
                                <Navigate to='/not-have-permission' />
                            )
                        }
                    />
                    <Route
                        path='user/*'
                        element={
                            isLoggedIn && roleId == 2 ? (
                                <MainApp setHeaderTitle={setHeaderTitle} roleId={roleId} />
                            ) : (
                                <Navigate to='/not-have-permission' />
                            )
                        }
                    />
                    <Route
                        path='/not-have-permission'
                        element={<NotHavePermission />}
                    />
                    <Route
                        path='*'
                        element={isLoggedIn ? <Navigate to={getHomePath(roleId)} /> : <Navigate to={"/"} />}
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
