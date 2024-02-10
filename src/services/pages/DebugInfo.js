import React from 'react';
import '../../assets/styles/SearchBar.css';

const DebugInfo = ({ responseText, requestQuery }) => {
    // Function to format JSON data nicely for <pre> display
    const formatJson = (json) => {
        try {
            return JSON.stringify(json, null, 2); // spacing level = 2
        } catch (error) {
            return `Error formatting JSON: ${error.message}`;
        }
    };

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
