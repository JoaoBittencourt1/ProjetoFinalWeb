import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginContainer from './components/Logincontainer/Logincontainer';
import RegisterContainer from './components/RegisterContainer/RegisterContainer';
import HomePrototype from './components/HomePrototype/HomePrototype';
import PrivateRoute from './components/PrivateRoute';

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<LoginContainer />} />
                <Route path="/register" element={<RegisterContainer />} />
                <Route 
                    path="/home-prototype" 
                    element={
                        <PrivateRoute>
                            <HomePrototype />
                        </PrivateRoute>
                    } 
                />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
}
