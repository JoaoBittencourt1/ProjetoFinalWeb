import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {
    const isAuthenticated = localStorage.getItem('user') !== null;

    if (!isAuthenticated) {
        // Redireciona para o login se não estiver autenticado
        return <Navigate to="/login" replace />;
    }

    // Se estiver autenticado, renderiza o componente filho
    return children;
} 