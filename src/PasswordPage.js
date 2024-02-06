import React, { useState } from 'react';

function PasswordPage({ onPasswordSuccess }) {
    const [password, setPassword] = useState('');
    const correctPassword = process.env.MY_SECRET;

    const handleSubmit = (event) => {
        console.log("coorect pass :: "+ correctPassword);
        event.preventDefault();
        if (password === correctPassword) {
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