import { useEffect, useState } from 'react';
import './App.css';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { HeaderComponent } from './components/commons/HeaderComponent';
import { LogInComponent } from './components/auth/LogInComponent';
import { MainApp } from './components/MainApp';

function App() {
    const [headerTitle, setHeaderTitle] = useState<string>('Online Asset Management');
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(Boolean(localStorage.getItem('isLoggedIn')) === true);
    const [username, setUsername] = useState('');

    useEffect(() => {
        setIsLoggedIn(Boolean(localStorage.getItem('isLoggedIn')) === true);
    }, []);

    const handleGetUsername = (username: string) => {
        setUsername(username);
    }

    const handleLogin = () => {
        setIsLoggedIn(true);
        localStorage.setItem('isLoggedIn', 'true');
    };

    const handleLogout = (state: boolean, title: string) => {
        if (state) {
            setHeaderTitle(title);
            setIsLoggedIn(false);
            localStorage.removeItem('loginResponse');
        }
    };

    return (
        <Router>
            <div style={{ flexFlow: 'column', height: '100%' }}>
                <HeaderComponent title={headerTitle} handleLogout={handleLogout} logo={isLoggedIn ? '' : '/nashtech_logo.svg'} username={username} />
                <Routes>
                    <Route
                        path='/'
                        element={isLoggedIn ? <Navigate to={'/admin/home'} /> : <LogInComponent setIsLoggedIn={handleLogin} setUsername={handleGetUsername} />}
                    />
                    <Route
                        path='admin/*'
                        element={isLoggedIn ? <MainApp setHeaderTitle={setHeaderTitle} /> : <Navigate to={'/'} />}
                    />
                    <Route
                        path='*'
                        element={<Navigate to={'/'} />}
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
