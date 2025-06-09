import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginContainer from './components/Logincontainer/Logincontainer';
import RegisterContainer from './components/RegisterContainer/RegisterContainer';

export default function App() {
    return ( <
        Router >
        <
        Routes >
        <
        Route path = "/login"
        element = { < LoginContainer / > }
        /> <
        Route path = "/register"
        element = { < RegisterContainer / > }
        /> <
        Route path = "*"
        element = { < LoginContainer / > }
        /> < /
        Routes > <
        /Router>
    );
}