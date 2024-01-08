import './SearchBar.css';
import debounce from 'lodash.debounce';
import {useCallback, useContext, useEffect, useRef, useState} from "react";
import JsonView from 'react18-json-view';
import 'react18-json-view/src/style.css';
import './TreeView.css';
import { ForceGraph2D } from 'react-force-graph';
// import 'bootstrap/dist/css/bootstrap.min.css';
import {AuthContext} from "./AuthProvider";
import Tree from "react-d3-tree"; // Default styles, dark mode available with 'dark.css'

// import { AuthContext } from './AuthProvider';



const SearchBar = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [responseText, setResponseText] = useState('');
    const [entryCount, setEntryCount] = useState(0);
    const [dropdownData, setDropdownData] = useState(null);
    const [title, setTitle] = useState('Type ahead menu');
    const [time, setTime] = useState('Search time');
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isSearchPopupOpen, setIsSearchPopupOpen] = useState(false);
    const [selectedItemDebugInfo, setSelectedItemDebugInfo] = useState(null);
    const [selectedItemName, setSelectedItemName] = useState(null);
    const [searchResults, setSearchResults] = useState(null);
    const [selectedItemInfo, setSelectedItemInfo] = useState(null);
    const [selectedItemInfoName, setSelectedItemInfoName] = useState(null);
    const [recsRequest, setRecsRequest] = useState(null);
    const [isRecsPopupOpen, setIsRecsPopupOpen] = useState(false);
// eslint-disable-next-line react-hooks/rules-of-hooks
    // Initialize state with values from localStorage or default to empty strings
    const [login, setLogin] = useState(localStorage.getItem('login') || '');
    const [password, setPassword] = useState(localStorage.getItem('password') || '');
    const [url, setUrl] = useState(localStorage.getItem('url') || '');
    const [pipeline, setPipeline] = useState(localStorage.getItem('pipeline') || 'mouser_typeahead_v2');

    useEffect(() => {
        setLogin(localStorage.getItem('login') || '');
        setPassword(localStorage.getItem('password') || '');
        setUrl(localStorage.getItem('url') || '');
        setPipeline(localStorage.getItem('pipeline') || 'mouser_typeahead_v2');
    }, []);

    // Update localStorage whenever values change
    useEffect(() => {
        localStorage.setItem('login', login);
        localStorage.setItem('password', password);
        localStorage.setItem('url', url);
        localStorage.setItem('pipeline', pipeline);
    }, [login, password, url]);

    const debouncedTypeaheadSearch = useCallback(
        debounce(async (query) => {
            if (query.length > 2) { // Only search if the user has typed more than 2 characters
                await fetchTypeAheadRequest(setDropdownData, setResponseText, entryCount, setEntryCount, query, setTitle);
            }
        }, 300),
        [] // Dependency array, empty means the debounce function won't change
    );
    const debouncedSearch = useCallback(
        debounce(async (query) => {
            if (query.searchQuery.length > 2) { // Only search if the user has typed more than 2 characters
                await fetchSearchRequest(query.searchQuery, setSearchResults, entryCount, setEntryCount, setTime, setResponseText, time);
            }
        }, 300),
        [] // Dependency array, empty means the debounce function won't change
    );

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        debouncedTypeaheadSearch(value);
    };
    const getSearchResults = (e) => {
        const value = {searchQuery};
        console.log("getSearchResults:: " + value);
        debouncedSearch(value);
    };

    return (
        <div>
            <div>
                <input
                    className="auth-input"
                    type="text"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    placeholder="login"
                />
                <input
                    className="auth-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="password"
                />
                <input
                    className="auth-input"
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="url"
                />
                <input
                    className="auth-input"
                    type="text"
                    value={pipeline}
                    onChange={(e) => setPipeline(e.target.value)}
                    placeholder="pipeline"
                />
            </div>
            <div class="container">
                <textarea
                    className="response-textarea"
                    value={responseText}
                    placeholder="Errors will be here"
                    rows={10}
                    readOnly
                />

                <div className="search-container">
                    <input
                        className="search-bar"
                        type="text"
                        value={searchQuery}
                        onChange={handleSearch}
                        placeholder="Search..."
                    />
                    <button className="search-button" onClick={getSearchResults}>
                        Search
                    </button>
                </div>
                <div className="table-container">
                    <table>
                        <tbody>
                        <tr>
                            <td><b>Type ahead menu</b>
                                {dropdownData && (
                                    <>
                                        <b className="container-header"> {title}</b>
                                        {dropdownData.grouped.type.groups.map((group, index) => (
                                            <div key={index} className="group-section">
                                                <div className="group-header">{group.groupValue}</div>
                                                <table>
                                                    <tbody>
                                                    {group.doclist.docs.map((doc, idx) => (
                                                        <tr key={idx}>
                                                            <td onClick={() => {
                                                                setSelectedItemDebugInfo(dropdownData.debug.explain[doc.id]);
                                                                setSelectedItemName(doc.display_name);
                                                                setIsPopupOpen(true);
                                                            }}>{doc.display_name}</td>
                                                            <td>{doc.score}</td>
                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ))}
                                    </>
                                )}
                                <Popup
                                    isOpen={isPopupOpen}
                                    onClose={() => setIsPopupOpen(false)}
                                    selectedItemDebugInfo={selectedItemDebugInfo}
                                    selectedItemName={selectedItemName}
                                />
                            </td>

                            {/* Second column for search results */}
                            <td><b>Search</b>
                                {searchResults && (
                                    <>
                                        <b className="container-header">{time}</b>
                                        <table>
                                            <tbody>
                                            {searchResults?.response?.docs.map((doc, idx) => (
                                                <tr key={idx}>
                                                    <td onClick={() => {
                                                        setSelectedItemInfo(doc);
                                                        setSelectedItemInfoName(doc.ProductClassName_s);
                                                        setIsSearchPopupOpen(true);
                                                    }}>{doc.ProductClassName_s}</td>
                                                    <td>{doc.score}</td>
                                                    <td onClick={() => {
                                                        setRecsRequest(doc.ProductId_l);
                                                        setIsRecsPopupOpen(true);
                                                    }
                                                    }>recs
                                                    </td>
                                                    <td onClick={() => {
                                                        setSelectedItemDebugInfo(searchResults.debug.explain[doc.ProductId_l]);
                                                        setSelectedItemName(doc.display_name);
                                                        setIsPopupOpen(true);
                                                    }
                                                    }>debug
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </>
                                )}
                                <SearchPopup
                                    isSearchPopupOpen={isSearchPopupOpen}
                                    onClose={() => setIsSearchPopupOpen(false)}
                                    selectedItemInfo={selectedItemInfo}
                                    selectedItemInfoName={selectedItemInfoName}
                                />
                                <RecsRequest
                                    isRecsPopupOpen={isRecsPopupOpen}
                                    onClose={() => setIsSearchPopupOpen(false)}
                                    recsRequest={recsRequest}
                                />
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>

            </div>

        </div>
    );
};
const RecsRequest = ({isRecsPopupOpen, onClose, recsRequest}) => {
    if (!isRecsPopupOpen) return null;
}

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

function wrap( line ) {
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
const Popup = ({ isOpen, onClose, selectedItemDebugInfo, selectedItemName }) => {
    const [treeData, setTreeData] = useState([]);

    useEffect(() => {
        const buildTree = (data) => {
            console.log("Processing data:", data);
            if (!data) return null; // Check if data is undefined or null
            const lines = wrap(data?.description?.toString() || '');
            const attributes = {
            };
            if (Array.isArray(lines)){
                lines.forEach((line, index) => {
                    attributes[`${index + 1}`] = line;
                });
            }else {
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
                <div className="popup-content" >
                    {treeData.length > 0 && (
                        <Tree
                            data={treeData}
                            orientation="vertical"
                            translate={{x: 250, y: 50}}
                            collapsible={true}
                            zoomable={true}
                            pathFunc="step"
                            nodeSize={{ x: 100, y: 100 }} // Adjust the x and y values as needed
                            separation={{ siblings: 5, nonSiblings: 3 }} // Adjust the separation between nodes
                            depthFactor={200}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
function getRandomNumber() {
    return Math.floor(Math.random() * 1_000_000_000) + 1;
}
async function fetchTypeAheadRequest(setDropdownData, setResponseText, entryCount, setEntryCount, searchQuery, setTitle) {

    var login = localStorage.getItem('login') || '';
    var password = localStorage.getItem('password') || '';
    var url = localStorage.getItem('url') || '';
    var pipeline = localStorage.getItem('pipeline') || '';
    const proxyUrl = 'https://corsproxy.io/?'; // Replace with your actual proxy URL

    const targetUrl = `https://${url}/api/apps/mouser/query/${pipeline}?q=${searchQuery}&debug=results&debug.explain.structured=true&fl=*,score&t=${getRandomNumber()}`;
    const encodedCredentials = btoa(`${login}:${password}`);
    const currentTime = new Date();
    const startTime = Date.now(); // Start time in milliseconds
    try {
        const response = await fetch(proxyUrl + targetUrl, {
            method: 'GET',
            cache: 'reload',
            headers: {
                'Accept': '*/*',
                'Pragma':'no-cache',
                'Cache-Control':'max-age=0',
                'Authorization': `Basic ${encodedCredentials}`,
            }
        });
        setEntryCount(entryCount+1);
        if (!response.ok) {
            const errorText = await response.text(); // Get the response text even if the response is not ok
            setResponseText(prevText => `${prevText}${prevText ? '\n' : ''}${entryCount}::${currentTime} ::  Error: ${response.status} - ${errorText}`);
            setEntryCount(entryCount + 1);
            return;
        }


        const data = await response.json();
        // todo debug window
        // setResponseText(prevText =>  targetUrl);
        setDropdownData(data);
    } catch (error) {
        console.error('Fetch error:', error);
    } finally {
        const endTime = Date.now();
        const duration = endTime - startTime; // Duration in milliseconds
        setTitle(`${duration} ms`);
    }
}


async function fetchSearchRequest(query, setSearchResults, entryCount, setEntryCount, setTime, setResponseText) {
    var login = localStorage.getItem('login') || '';
    var password = localStorage.getItem('password') || '';
    var url = localStorage.getItem('url') || '';
    const proxyUrl = 'https://corsproxy.io/?'; // Replace with your actual proxy URL
    const targetUrl = `https://${url}/api/apps/mouser/query/mouser?q=${query}&debug=results&debug.explain.structured=true&fl=*,score&t=${getRandomNumber()}`;
    const encodedCredentials = btoa(`${login}:${password}`);
    const currentTime = new Date();
    const startTime = Date.now(); // Start time in milliseconds
    try {
        const response = await fetch(proxyUrl + targetUrl, {
            method: 'GET',
            cache: 'no-cache',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'Pragma':'no-cache',
                'Cache-Control':'max-age=0',
                'Authorization': `Basic ${encodedCredentials}`,
                'Content-type': '*/*',
            }
        });
        if (entryCount > 1_000_000_000){
            await setEntryCount(0);
        }
        if (!response.ok) {
            const errorText = await response.text(); // Get the response text even if the response is not ok
            setResponseText(prevText => `${prevText}${prevText ? '\n' : ''}${entryCount}::${currentTime} ::  Error: ${response.status} - ${errorText}`);
            setEntryCount(entryCount + 1);
            return;
        }


        const data = await response.json();
        setSearchResults(data);
    } catch (error) {
        console.error('Fetch error:', error);
    } finally {
        const endTime = Date.now();
        const duration = endTime - startTime; // Duration in milliseconds
        setTime(`${duration} ms`);
    }
}

export default SearchBar;
