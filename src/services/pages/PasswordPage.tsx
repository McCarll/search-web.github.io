import React, {useState, useEffect, FormEvent, ChangeEvent} from 'react';

interface PasswordPageProps {
    onPasswordSuccess: () => void;
}

const PasswordPage: React.FC<PasswordPageProps> = ({ onPasswordSuccess }) => {
    // It's good to explicitly declare the type of state when it can be null
    const [password, setPassword] = useState<string | null>(localStorage.getItem('startup-password'));

    useEffect(() => {
        // Ensure password is not null before setting it
        if (password) {
            localStorage.setItem('startup-password', password);
        }
    }, [password]); // Don't forget to add dependencies to useEffect

    useEffect(() => {
        setPassword(localStorage.getItem('startup-password'));
    }, []);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Make sure to compare against a string, as localStorage.getItem can return null
        if (password === process.env.REACT_APP_MY_NEW_CUSTOM_SECRET_ENV_NAME) {
            onPasswordSuccess();
        } else {
            alert('Incorrect Password');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Password:
                    <input
                        type="password"
                        value={password || ''} // Handle null state for controlled input
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    />
                </label>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default PasswordPage;