import React from 'react';
import {Graphviz } from 'graphviz-react';
interface SemanticSearchGraphProps {
    dotStrings: string[];
}

const SemanticSearchGraph: React.FC<SemanticSearchGraphProps> = ({ dotStrings }) => {
    const graph = Array.isArray(dotStrings) ? dotStrings[0] :String(dotStrings);
    return (
        <div style={{ textAlign: 'center' }}>
            {graph && (
                <Graphviz
                    dot={graph}
                    options={{
                        height: '100%',
                        width: '100%',
                        fit: true,
                        zoom: true
                    }}
                />
            )}
        </div>
    );
};

export default SemanticSearchGraph;
