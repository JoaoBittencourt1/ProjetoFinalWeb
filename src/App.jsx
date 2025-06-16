import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginContainer from './components/Logincontainer/Logincontainer';
import RegisterContainer from './components/RegisterContainer/RegisterContainer';
import HomePrototype from './components/HomePrototype/HomePrototype';
import GruposMenu from './components/Grupos/GruposMenu';
import GruposCriar from './components/Grupos/GruposCriar';
import GruposEntrar from './components/Grupos/GruposEntrar';
import PrivateRoute from './components/PrivateRoute';
import GrupoHome from './components/Grupos/GrupoHome';
import UserList from './components/UserList/UserList';

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<LoginContainer />} />
                <Route path="/register" element={<RegisterContainer />} />
                <Route 
                    path="/home" 
                    element={
                        <PrivateRoute>
                            <HomePrototype />
                        </PrivateRoute>
                    } 
                />
                <Route path="/grupos" element={<GruposMenu />} />
                <Route path="/grupos-entrar" element={<GruposEntrar />} />
                <Route path="/grupos-criar" element={<GruposCriar />} />
                <Route path="/grupo/:id_grupo" element={<GrupoHome />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
                <Route path="/usuarios" element={<UserList />} />
            </Routes>
        </Router>
    );
}