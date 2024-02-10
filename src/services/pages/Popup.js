import {useEffect, useState} from "react";
import Tree from "react-d3-tree";

const Popup = ({isOpen, onClose, selectedItemDebugInfo}) => {
    const [treeData, setTreeData] = useState([]);

    useEffect(() => {
        const buildTree = (data) => {
            console.log("Processing data:", data);
            if (!data) return null; // Check if data is undefined or null
            const lines = wrap(data?.description?.toString() || '');
            const attributes = {};
            if (Array.isArray(lines)) {
                lines.forEach((line, index) => {
                    attributes[`${index + 1}`] = line;
                });
            } else {
                attributes['0'] = lines;
            }
            return {
                name: 'score: ' + data?.value?.toString() || '',
                attributes: attributes,
                children: data.details ? data.details.map(buildTree).filter(child => child) : []
            };
        };

        if (selectedItemDebugInfo) {
            const root = buildTree(selectedItemDebugInfo);
            setTreeData([root]);
        }
    }, [selectedItemDebugInfo]);
    if (!isOpen) return null;
    return (
        <div className="popup">
            <div className="popup-inner">
                <div className="popup-header">
                    <span className="popup-title">Debug Info</span>
                    <button className="popup-close-btn" onClick={onClose}>X</button>
                </div>
                <div className="popup-content">
                    {treeData.length > 0 && (
                        <Tree
                            data={treeData}
                            orientation="vertical"
                            translate={{x: 250, y: 50}}
                            collapsible={true}
                            zoomable={true}
                            pathFunc="step"
                            nodeSize={{x: 100, y: 100}} // Adjust the x and y values as needed
                            separation={{siblings: 5, nonSiblings: 3}} // Adjust the separation between nodes
                            depthFactor={200}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

function wrap(line) {
    const MAX_CHARS_PER_LINE = 30;
    let lines = [];
    let currentLine = '';

    for (const char of line) {
        if (currentLine.length + 1 <= MAX_CHARS_PER_LINE) {
            currentLine += char;
        } else {
            lines.push(currentLine);
            currentLine = char;
        }
    }

    // Add the last line if it's not empty
    if (currentLine) {
        lines.push(currentLine);
    }
    return lines;
}
export default Popup;