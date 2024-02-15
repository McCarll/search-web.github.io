import React from 'react';
import '../../assets/styles/SearchBar.css';

const AuthForm = ({ auth, setAuthField }) => {
    return (
        <table className="auth-table">
            <tbody>
            <th>request pattern:: https://<u>URL</u>/api/apps/app_name/query/<u>PROFILE</u>?q=<u>query</u></th>
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
                        onChange={(e) =>  setAuthField('password', e.target.value)}
                        // onChange={(e) =>  auth.setPassword(e.target.value)}
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
                        onChange={(e) =>  setAuthField('url', e.target.value)}
                        // onChange={(e) =>  auth.setUrl(e.target.value)}
                        placeholder="url"
                    />
                </td>
            </tr>
            <tr>
                <td>typeahead profile</td>
                <td>
                    <input
                        title={"Typeahead profile"}
                        className="auth-input"
                        type="text"
                        value={auth.pipeline}
                        onChange={(e) =>  setAuthField('pipeline', e.target.value)}
                        // onChange={(e) =>  auth.setPipeline(e.target.value)}
                        placeholder="typeahead profile"
                    />
                </td>
            </tr>
            <tr>
                <td>search profile</td>
                <td>
                    <input
                        title={"Search profile"}
                        className="auth-input"
                        type="text"
                        value={auth.searchProfile}
                        onChange={(e) =>  setAuthField('searchProfile', e.target.value)}
                        // onChange={(e) =>  auth.setSearchProfile(e.target.value)}
                        placeholder="search profile"
                    />
                </td>
            </tr>
            <tr>
                <td>recommendation<br/> profile</td>
                <td>
                    <input
                        title={"Recs profile"}
                        className="auth-input"
                        type="text"
                        value={auth.recsProfile}
                        onChange={(e) =>  setAuthField('recsProfile', e.target.value)}
                        // onChange={(e) =>  auth.setRecsProfile(e.target.value)}
                        placeholder="recs profile"
                    />
                </td>
            </tr>

            </tbody>
        </table>
    );
};

export default AuthForm;
