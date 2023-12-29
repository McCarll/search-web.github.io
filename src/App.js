import logo from './logo.svg';
import './App.css';
import SearchBar from "./SearchBar";
import AuthProvider from "./Auth";
import Auth from "./Auth";

function App() {
    return (
        <div className="App">
            {/*<AuthProvider>*/}
                {/*<Auth/>*/}
                <SearchBar/>
            {/*</AuthProvider>*/}
        </div>
    );
}

export default App;
