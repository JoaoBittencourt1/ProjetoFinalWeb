import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginContainer from './components/Logincontainer/Logincontainer';
import RegisterContainer from './components/RegisterContainer/RegisterContainer';
import HomePrototype from './components/HomePrototype/HomePrototype'; // <- import novo

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginContainer />} />
                <Route path="/register" element={<RegisterContainer />} />
                <Route path="/home-prototype" element={<HomePrototype />} /> {/* <- nova rota */}
                <Route path="*" element={<LoginContainer />} />
            </Routes>
        </Router>
    );
}
