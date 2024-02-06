import React, { useState } from 'react';
function PasswordPage({ onPasswordSuccess }) {
    const [password, setPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default PasswordPage;