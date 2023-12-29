import React, {useState, createContext} from "react";

export const AuthContext = createContext({
    login: '',
    setLogin: () => {},
    password: '',
    setPassword: () => {}
});
export const AuthProvider = ({ children }) => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');

    return (
        <AuthContext.Provider value={{ login, setLogin, password, setPassword }}>
            {children}
        </AuthContext.Provider>
    );
};


// export default AuthProvider;