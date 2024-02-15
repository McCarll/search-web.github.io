const ErrorModal = ({ isOpen, onClose, errorBody }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h2>Error Details</h2>
                <pre>{errorBody}</pre>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};