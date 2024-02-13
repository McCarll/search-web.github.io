import {useEffect, useState} from "react";

const RecsRequest = ({
                         isRecsPopupOpen,
                         onClose,
                         recsResponse,
                         sourceItem,
                         searchRecsType,
                         setSearchRecsType,
                         isLoading,
                         setRecsQuery,
                         recsQuery
                     }) => {
    const [position, setPosition] = useState({ x: 100, y: 100 });

    useEffect(() => {
        const popupHeader = document.querySelector('.popup-header'); // Target the popup header

        if (popupHeader) {
            const handleDragStart = (e) => {
                const startX = e.clientX - position.x;
                const startY = e.clientY - position.y;

                const handleDragging = (moveEvent) => {
                    setPosition({
                        x: moveEvent.clientX - startX,
                        y: moveEvent.clientY - startY,
                    });
                };

                const handleDragEnd = () => {
                    document.removeEventListener('mousemove', handleDragging);
                    document.removeEventListener('mouseup', handleDragEnd);
                };

                document.addEventListener('mousemove', handleDragging);
                document.addEventListener('mouseup', handleDragEnd);
            };

            popupHeader.addEventListener('mousedown', handleDragStart);

            return () => {
                popupHeader.removeEventListener('mousedown', handleDragStart);
            };
        }
    }, [isRecsPopupOpen, position]);
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

    // This function now just updates local state
    const handleDropdownChange = (event) => {

        setSearchRecsType(event.target.value);
        console.log("type " + event.target.value);
        switch (event.target.value) {
            case("partnumber"): {
                setRecsQuery(sourceItem['PARTNUMBER_s']);
                console.log("query " + sourceItem['PARTNUMBER_s']);
                break;
            }
            case("mouserpartnumber"): {
                setRecsQuery(sourceItem['MouserPartNumber_s']);
                console.log("query " + sourceItem['MouserPartNumber_s']);
                break;
            }
            case("productid"): {
                setRecsQuery(sourceItem['ProductId_l'] + "");
                console.log("query " + sourceItem['ProductId_l']);
                break;
            }
        }
    };
    return (
        <div className="popup" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <div
                className="popup-inner"
                style={{
                    position: 'absolute',
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                }}
            >
                <div className="popup-header" style={{cursor: 'move'}}>
                    <span className="popup-title">Item to items</span>
                    {/*<span className="popup-title">search by {searchRecsType}</span>*/}
                    <div className="dropdown-container">
                        <span>Search by </span>
                        <select onChange={handleDropdownChange}>
                            <option value="productid">productid</option>
                            <option value="mouserpartnumber">mouser part number</option>
                            <option value="partnumber">partnumber</option>
                        </select>
                    </div>
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
                            {isLoading ? (
                                <div>Loading...</div>
                            ) : (
                                <>
                                    <td>
                                        {recsResponse && recsResponse.response && recsResponse.response.docs.map((doc, idx) => (
                                            <div key={idx} className="recs-item">
                                                <h3>Item {idx + 1}</h3>
                                                {renderTable(doc)}
                                            </div>
                                        ))}
                                    </td>
                                </>

                            )}
                            </tbody>
                        </table>
                    </div>


                </div>
            </div>
        </div>
    );
};
export default RecsRequest;