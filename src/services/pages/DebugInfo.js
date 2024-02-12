import React from 'react';
import '../../assets/styles/SearchBar.css';

const DebugInfo = ({ responseText, requestQuery }) => {

    return (
        <table>
            <tbody>
            <tr>
                <div className="error_response_div">
                        <textarea
                            className="response-textarea"
                            value={responseText}
                            placeholder="Errors will be here"
                            rows={10}
                            readOnly
                        />
                </div>
            </tr>
            <div>
                        <textarea
                            className="response-textarea"
                            value={requestQuery}
                            placeholder="requests will here"
                            rows={10}
                            readOnly
                        />
            </div>
            </tbody>
        </table>
    );
};

export default DebugInfo;
