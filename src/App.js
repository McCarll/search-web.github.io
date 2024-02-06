import logo from './logo.svg';
import './App.css';
import SearchBar from "./SearchBar";
import AuthProvider from "./Auth";
import Auth from "./Auth";
import {useState} from "react";
import PasswordPage from "./PasswordPage";
// require('dotenv').config();

function App() {
    const [accessGranted, setAccessGranted] = useState(false);

    const handlePasswordSuccess = () => {
        setAccessGranted(true);
    };

    return (
        <div className="App">
            {accessGranted ? (
                <SearchBar/>
            ) : (
                <PasswordPage onPasswordSuccess={handlePasswordSuccess} />
            )}
        </div>
    );
}

export default App;
