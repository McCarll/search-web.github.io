import React, { useRef } from 'react';
import { Request } from './DebugInfo';

interface DraggablePopupProps {
    content: Request | null;
    onClose: () => void;
}

const DraggablePopup: React.FC<DraggablePopupProps> = ({ content, onClose }) => {
    const popupRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
        const popup = popupRef.current;
        if (!popup) return;

        const shiftX = e.clientX - popup.getBoundingClientRect().left;
        const shiftY = e.clientY - popup.getBoundingClientRect().top;

        const handleMouseMove = (e: MouseEvent) => {
            if (!popup) return;

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
            {content?.errorDetails}
            <button onClick={onClose}>Close</button>
        </div>
    );
};

export default DraggablePopup;
