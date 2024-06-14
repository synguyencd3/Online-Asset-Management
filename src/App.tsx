import { useState } from 'react';
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { HeaderComponent } from './components/commons/HeaderComponent';
import { LogInComponent } from './components/auth/LogInComponent';
import { MainApp } from './components/MainApp';

function App() {
    const [headerTitle, setHeaderTitle] = useState<string>('LOG IN');
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    console.log(isLoggedIn);

    return (
        <Router>
            <div style={{ flexFlow: 'column', height: '100%' }}>
                <HeaderComponent title={headerTitle} />
                {isLoggedIn ? (
                    <MainApp setHeaderTitle={setHeaderTitle} />
                ) : (
                    <LogInComponent setIsLoggedIn={setIsLoggedIn} />
                )}
            </div>
        </Router>
    );
}

export default App;
