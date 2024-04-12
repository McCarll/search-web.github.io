import React from 'react';
import * as d3 from 'd3';
// import { graphviz } from 'd3-graphviz';
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
function unescapeDot(dotString: string): string {
    return dotString.replace(/\\n/g, '\n').replace(/\\"/g, '"');
}


export default SemanticSearchGraph;
