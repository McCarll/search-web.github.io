import './assets/styles/App.css';
import SearchBar from "./services/pages/SearchBar";
import {useState} from "react";
import PasswordPage from "./services/pages/PasswordPage";

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
