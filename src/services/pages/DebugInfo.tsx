import React, {useState} from 'react';
import '../../assets/styles/DebugInfo.css';
import DraggablePopup from "./DraggablePopup";

export interface Request {
    queryType: string;
    url: string;
    responseCode: number;
    responseTime: number;
    errorDetails: string;
}

interface DebugInfoProps {
    requests: Request[]
}

const DebugInfo: React.FC<DebugInfoProps> = ({ requests }) => {
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [popupContent, setPopupContent] = useState<Request | null>(null);

    const handleErrorClick = (request: Request) => {
        setPopupContent(request);
        setIsPopupVisible(true);
    };

    return (
        <>
            <div className="debug-table-container">
                <table>
                    <thead>
                    <tr>
                        <th style={{width: '10%', }}>Query Type</th>
                        <th style={{width: '68%'}}>URL</th>
                        <th style={{width: '10%'}}>Response Code</th>
                        <th style={{width: '10%'}}>Response Time</th>
                    </tr>
                    </thead>
                    <tbody>
                    {requests.slice(0, 10).map((request, index) => (
                        <tr key={index}>
                            <td style={{width: '10%', ...getFontSizeStyle(request.queryType)}}>{request.queryType}</td>
                            <td style={{width: '50%'}}>{request.url}</td>
                            <td>
                                {request.responseCode !== 200 ? (
                                    <span onClick={() => handleErrorClick(request)}
                                          style={{cursor: 'pointer'}}>
                                        {request.responseCode}
                                    </span>
                                ) : (
                                    request.responseCode
                                )}
                            </td>
                            <td style={{width: '10%'}}>{request.responseTime}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            {isPopupVisible && (
                <DraggablePopup
                    content={popupContent}
                    onClose={() => setIsPopupVisible(false)}
                />
            )}
        </>
    );
};
const getFontSizeStyle = (text: string) => {
    const threshold = 10;
    if (text.length > threshold) {
        return {fontSize: '0.8em'};
    }
    return {};
};

export default DebugInfo;