const RecsRequest = ({ isRecsPopupOpen, onClose, recsResponse, sourceItem }) => {
    if (!isRecsPopupOpen) return null;

    const renderTable = (item) => (
        <table key={new Date()}>
            <thead>
            <tr>
                <th>Parameter Name</th>
                <th>Value</th>
            </tr>
            </thead>
            <tbody>
            {Object.entries(item).map(([paramName, value], idx) => (
                <tr key={idx}>
                    <td title={paramName}>{paramName}</td>
                    <td title={value}>{value}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );

    return (
        <div className="popup">
            <div className="popup-inner">
                <div className="popup-header">
                    <span className="popup-title">Item to items</span>
                    <button className="popup-close-btn" onClick={onClose}>X</button>
                </div>
                <div className="popup-content">
                    <p>Total Found: {recsResponse?.response?.numFound}</p>
                    <div className="comparison-container">
                        <table className="table table-responsive">
                            <tbody>
                            <td>
                                <div className="source-item">
                                    <h3>Source Item</h3>
                                    {renderTable(sourceItem)}
                                </div>
                            </td>
                            <td>
                                {recsResponse && recsResponse.response && recsResponse.response.docs.map((doc, idx) => (
                                    <div key={idx} className="recs-item">
                                        <h3>Item {idx + 1}</h3>
                                        {renderTable(doc)}
                                    </div>
                                ))}
                            </td>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default RecsRequest;