import JsonView from "react18-json-view";

const SearchPopup = ({isSearchPopupOpen, onClose, selectedItemInfo, selectedItemInfoName}) => {
    if (!isSearchPopupOpen) return null;
    return (
        <div className="popup">
            <div className="popup-inner">
                <div className="popup-header">
                    <span className="popup-title">Item info {selectedItemInfoName}</span>
                    <button className="popup-close-btn" onClick={onClose}>X</button>
                </div>
                <div className="popup-content">
                    <table>
                        <thead>
                        <tr>
                            <th>Field</th>
                            <th>Value</th>
                        </tr>
                        </thead>
                        <tbody>
                        {Object.entries(selectedItemInfo).map(([key, value]) => (
                            <tr key={key}>
                                <td>{key}</td>
                                <td>{JSON.stringify(value)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <JsonView src={selectedItemInfo} collapsed={true} className="custom-json-view"/>
                </div>
            </div>
        </div>
    );
}
export default SearchPopup;