import React from 'react';
import '../../assets/styles/SearchBar.css';

// Define the shape of the auth object
interface AuthFields {
    login: string;
    password: string;
    url: string;
    pipeline: string;
    searchProfile: string;
    recsProfile: string;
}

// Define the props expected by the AuthForm component
interface AuthFormProps {
    auth: AuthFields;
    setAuthField: (field: keyof AuthFields, value: string) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({auth, setAuthField}) => {
    return (
        <table className="auth-table">
            <tbody>
            <tr>
                <th>request pattern:: https://<u>URL</u>/api/apps/app_name/query/<u>PROFILE</u>?q=<u>query</u></th>
            </tr>
            <tr>
                <td>
                    <b>login</b>
                </td>
                <td>
                    <input
                        className="auth-input"
                        type="text"
                        value={auth.login}
                        onChange={(e) => setAuthField('login', e.target.value)}
                        placeholder="login"
                    />
                </td>
            </tr>
            <tr>
                <td>password</td>
                <td>
                    <input
                        className="auth-input"
                        type="password"
                        value={auth.password}
                        onChange={(e) => setAuthField('password', e.target.value)}
                        placeholder="password"
                    />
                </td>
            </tr>
            <tr>
                <td>url</td>
                <td>
                    <input
                        className="auth-input"
                        type="text"
                        value={auth.url}
                        onChange={(e) => setAuthField('url', e.target.value)}
                        placeholder="url"
                    />
                </td>
            </tr>
            <tr>
                <td>typeahead profile</td>
                <td>
                    <input
                        title="Typeahead profile"
                        className="auth-input"
                        type="text"
                        value={auth.pipeline}
                        onChange={(e) => setAuthField('pipeline', e.target.value)}
                        placeholder="typeahead profile"
                    />
                </td>
            </tr>
            <tr>
                <td>search profile</td>
                <td>
                    <input
                        title="Search profile"
                        className="auth-input"
                        type="text"
                        value={auth.searchProfile}
                        onChange={(e) => setAuthField('searchProfile', e.target.value)}
                        placeholder="search profile"
                    />
                </td>
            </tr>
            <tr>
                <td>recommendation profile</td>
                <td>
                    <input
                        title="Recs profile"
                        className="auth-input"
                        type="text"
                        value={auth.recsProfile}
                        onChange={(e) => setAuthField('recsProfile', e.target.value)}
                        placeholder="recs profile"
                    />
                </td>
            </tr>
            </tbody>
        </table>
    );
};

export default AuthForm;
