import './Auth.css';
import {useState} from "react";

const Auth = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');

    const handleInputLogin = (e) => {
        setLogin(e.target.value);
    };

    const handleInputPassword = (e) => {
        setPassword(e.target.value);
    };

    return (
        <div>
            <input
                className="auth-input"
                type="text"
                value={login}
                onChange={handleInputLogin}
                placeholder="input login"
            />
            <input
                className="auth-input"
                type="password"
                value={password}
                onChange={handleInputPassword}
                placeholder="input password"
            />
        </div>
    );
};
export default Auth;