import './SearchBar.css';
import debounce from 'lodash.debounce';
import {useCallback, useContext, useEffect, useState} from "react";
import JsonView from 'react18-json-view';
import 'react18-json-view/src/style.css';
import './TreeView.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {AuthContext} from "./AuthProvider"; // Default styles, dark mode available with 'dark.css'

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

    useEffect(() => {
        setLogin(localStorage.getItem('login') || '');
        setPassword(localStorage.getItem('password') || '');
        setUrl(localStorage.getItem('url') || '');
    }, []);

    // Update localStorage whenever values change
    useEffect(() => {
        localStorage.setItem('login', login);
        localStorage.setItem('password', password);
        localStorage.setItem('url', url);
    }, [login, password, url]);

    const debouncedTypeaheadSearch = useCallback(
        debounce(async (query) => {
            if (query.length > 2) { // Only search if the user has typed more than 2 characters
                await fetchProxiedRequest(setDropdownData, setResponseText, entryCount, setEntryCount, query, setTitle);
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
                            {/* First column for dropdown data */}
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

function getBoostValue(description) {
    const regex = /\^(\d+(\.\d+)?)/;
    const match = description.match(regex);

    if (match) {
        return match[1]; // '2.0'
    }
}


// const SearchPopup = ({ onClose, selectedItemInfo, selectedItemInfoName}) => {
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
const renderTreeRows = (data, level = 0) => {
    const rows = [];

    // Check if the node should be skipped based on its description
    const skipNode = data.description.includes('sum of') || data.description.includes('max of');

    if (!skipNode) {
        // Add the current node's row if not skipped
        rows.push(
            <tr key={`level-${level}-${data.description}`}>
                <td style={{ paddingLeft: `${level * 20}px` }}>{data.description}</td>
                <td width="50">{data.match?.toString()}</td>
                <td>{data.value}</td>
            </tr>
        );
    }

    // If there are children, recursively render them
    if (Array.isArray(data.details) && data.details.length > 0) {
        data.details.forEach((child) => {
            const childRows = renderTreeRows(child, skipNode ? level : level + 1);
            if (childRows) {
                rows.push(...childRows);
            }
        });
    }

    return rows.length > 0 ? rows : null;
};


const Popup = ({ isOpen, onClose, selectedItemDebugInfo, selectedItemName }) => {
    if (!isOpen) return null;
    return (
        <div className="popup">
            <div className="popup-inner">
                <div className="popup-header">
                    <span className="popup-title">Debug Info</span>
                    <button className="popup-close-btn" onClick={onClose}>X</button>
                </div>
                <div className="popup-content">
                    <table>
                        <thead>
                        <tr>
                            <th>Description</th>
                            <th width="50">Match</th>
                            <th>Value</th>
                        </tr>
                        </thead>
                        <tbody>
                        {selectedItemDebugInfo.details && selectedItemDebugInfo.details.map((detail, index) =>
                            renderTreeRows(detail, 0)
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const Popup2 = ({isOpen, onClose, selectedItemDebugInfo, selectedItemName}) => {
    if (!isOpen) return null;

    return (

        <div className="popup">
            <div className="popup-inner">
                <div className="popup-header">
                    <span className="popup-title">Debug explain</span>
                    <button className="popup-close-btn" onClick={onClose}>X</button>
                </div>
                <div className="popup-content">
                    <table>
                        <tr>
                            <td>match</td>
                            <td>{selectedItemDebugInfo?.match + ""}</td>
                        </tr>
                        <tr>
                            <td>total score</td>
                            <td>{selectedItemDebugInfo?.value}</td>
                        </tr>
                        {

                            selectedItemName?.split(" ").length > 1 &&
                            selectedItemDebugInfo.details[0].details[0].details[0].details.map((detail, i) => (
                                <tr key={i}>
                                    <td>word info: {getSearchableWord(detail.description)}</td>
                                    <td>word score: {detail.value}</td>
                                    <td>word match: {detail.match + " "}</td>
                                </tr>
                            ))
                        }
                        {

                            selectedItemName?.split(" ").length > 1 &&
                            selectedItemDebugInfo.details[0].details[0].details.map((detail, i) => (
                                <tr key={i}>
                                    <td>word info: {getSearchableWord(detail.description)}</td>
                                    <td>word score: {detail.value}</td>
                                    <td>word match: {detail.match + " "}</td>
                                </tr>
                            ))
                        }
                        {
                            selectedItemName?.split(" ").length == 1 &&
                            selectedItemDebugInfo.details[0].details[0].details.map((detail, i) => (
                                <tr key={i}>
                                    <td>word info: {getSearchableWord(detail.description)}</td>
                                    <td>word score: {detail.value}</td>
                                    <td>word match: {detail.match + " "}</td>
                                </tr>
                            ))
                        }
                        <tr>
                            {selectedItemDebugInfo.details?.[1] && (
                                <td>suggestion boost: {getBoostValue(selectedItemDebugInfo.details[1].description)}</td>
                            )}
                        </tr>
                    </table>
                    <JsonView src={selectedItemDebugInfo} collapsed={true} className="custom-json-view"/>
                </div>
            </div>
        </div>
    );

};


function getSearchableWord(word) {
    const regex = ':(\\w+)';
    // const regex = /searchable_suggestions_edge:(\w+)/;
    const match = word.match(regex);

    if (match) {
        return match[1];
    }
    return word;
}

async function fetchProxiedRequest(setDropdownData, setResponseText, entryCount, setEntryCount, searchQuery, setTitle) {

    var login = localStorage.getItem('login') || '';
    var password = localStorage.getItem('password') || '';
    var url = localStorage.getItem('url') || '';
    const proxyUrl = 'https://corsproxy.io/?'; // Replace with your actual proxy URL
    const targetUrl = `https://${url}/api/apps/mouser/query/mouser_typeahead_v2?q=${encodeURIComponent(searchQuery)}&debug=results&debug.explain.structured=true&fl=*,score`;
    const encodedCredentials = btoa(`${login}:${password}`);
    const currentTime = new Date();
    const startTime = Date.now(); // Start time in milliseconds
    try {
        const response = await fetch(proxyUrl + targetUrl, {
            method: 'GET',
            // mode: 'no-cors',
            headers: {
                // 'Host':'mouser-dev.b.lucidworks.cloud:443',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'Authorization': `Basic ${encodedCredentials}`,
                'Content-type': 'application/json',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin',
                'Sec-Fetch-Dest': 'empty',
                'X-Requested-With': 'XMLHttpRequest',
                'Host': 'www.mouser.pl'
            }
            // Other fetch options
        });

        if (!response.ok) {
            const errorText = await response.text(); // Get the response text even if the response is not ok
            setResponseText(prevText => `${prevText}${prevText ? '\n' : ''}${entryCount}::${currentTime} ::  Error: ${response.status} - ${errorText}`);
            setEntryCount(entryCount + 1);
            return;
        }


        const data = await response.json();
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
    const targetUrl = `https://${url}/api/apps/mouser/query/mouser?q=${encodeURIComponent(query)}&debug=results&debug.explain.structured=true&fl=*,score`;
    const encodedCredentials = btoa(`${login}:${password}`);
    const currentTime = new Date();
    const startTime = Date.now(); // Start time in milliseconds
    try {
        const response = await fetch(proxyUrl + targetUrl, {
            method: 'GET',
            // mode: 'no-cors',
            headers: {
                // 'Host':'mouser-dev.b.lucidworks.cloud:443',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'Authorization': `Basic ${encodedCredentials}`,
                'Content-type': 'application/json',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin',
                'Sec-Fetch-Dest': 'empty',
                'X-Requested-With': 'XMLHttpRequest',
                'Host': 'www.mouser.pl'
            }
            // Other fetch options
        });

        if (!response.ok) {
            const errorText = await response.text(); // Get the response text even if the response is not ok
            setResponseText(prevText => `${prevText}${prevText ? '\n' : ''}${entryCount}::${currentTime} ::  Error: ${response.status} - ${errorText}`);
            setEntryCount(entryCount + 1);
            return;
        }


        const data = await response.json();
        setSearchResults(data);
        // setDebugData(data.debug);
        // setSuggestions(data);
        // setResponseText(''); // Clear any previous error message
    } catch (error) {
        console.error('Fetch error:', error);
    } finally {
        const endTime = Date.now();
        const duration = endTime - startTime; // Duration in milliseconds
        setTime(`${duration} ms`);
    }
}

export default SearchBar;
