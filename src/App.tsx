import { useEffect, useState } from 'react';
import './App.css';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { HeaderComponent } from './components/commons/HeaderComponent';
import { LogInComponent } from './components/auth/LogInComponent';
import { MainApp } from './components/MainApp';

function App() {
    const [headerTitle, setHeaderTitle] = useState<string>('LOG IN');
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

    useEffect(() => {
        setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    }, []);

    const handleLogin = () => {
        setIsLoggedIn(true);
        localStorage.setItem('isLoggedIn', 'true');
    };

    const handleLogout = (state: boolean, title: string) => {
        if (state) {
            setHeaderTitle(title);
            setIsLoggedIn(false);
            localStorage.removeItem('isLoggedIn');
        }
    };

    useEffect(() => {
        setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    }, []);

    return (
        <Router>
            <div style={{ flexFlow: 'column', height: '100%' }}>
                <HeaderComponent title={headerTitle} handleLogout={handleLogout} />
                <Routes>
                    <Route
                        path="/"
                        element={isLoggedIn ? <Navigate to="/admin/home" /> : <LogInComponent setIsLoggedIn={handleLogin} />}
                    />
                    <Route
                        path="/admin/*"
                        element={isLoggedIn ? <MainApp setHeaderTitle={setHeaderTitle} /> : <Navigate to="/" />}
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
