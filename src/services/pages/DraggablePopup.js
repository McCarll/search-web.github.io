import {useRef} from "react";

const DraggablePopup = ({ content, onClose }) => {
    const popupRef = useRef(null);

    const handleMouseDown = (e) => {
        const popup = popupRef.current;
        let shiftX = e.clientX - popup.getBoundingClientRect().left;
        let shiftY = e.clientY - popup.getBoundingClientRect().top;

        const handleMouseMove = (e) => {
            popup.style.left = e.pageX - shiftX + 'px';
            popup.style.top = e.pageY - shiftY + 'px';
        };

        document.addEventListener('mousemove', handleMouseMove);

        document.onmouseup = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.onmouseup = null;
        };
    };

    return (
        <div
            ref={popupRef}
            style={{
                width: '700px',
                height: '300px',
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 100,
                background: 'white',
                border: '1px solid #ccc',
                padding: '10px',
                cursor: 'move',
            }}
            onMouseDown={handleMouseDown}
        >
            {content.errorDetails}
            <button onClick={onClose}>Close</button>
        </div>
    );
};
export default DraggablePopup;
