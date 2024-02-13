import '../../assets/styles/SearchBar.css';
import debounce from 'lodash.debounce';
import {useCallback, useEffect,  useState} from "react";
import JsonView from 'react18-json-view';
import 'react18-json-view/src/style.css';
import '../../assets/styles/TreeView.css';
import AuthForm from "./AuthForm";
import DebugInfo from "./DebugInfo";
import SearchPopup from "./SearchPopup";
import RecsRequest from "./RecsRequest";
import Popup from "./Popup";
import {fetchSearchRecsRequest, fetchSearchRequest, fetchTypeAheadRequest} from "../../api/fetchRequests";




const SearchBar = () => {


    const [recsResponse, setRecsResponse] = useState('');
    const [entryCount, setEntryCount] = useState(0);
    const [time, setTime] = useState('Search time');
    const [responseText, setResponseText] = useState('');
    const [requestQuery, setRequestQuery] = useState('');
    const [searchRecsType, setSearchRecsType] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [recsQuery, setRecsQuery] = useState('');

    const [searchQuery, setSearchQuery] = useState('');
    const [dropdownData, setDropdownData] = useState(null);
    const [title, setTitle] = useState('Type ahead menu');
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isSearchPopupOpen, setIsSearchPopupOpen] = useState(false);
    const [selectedItemDebugInfo, setSelectedItemDebugInfo] = useState(null);
    const [searchResults, setSearchResults] = useState(null);
    const [selectedItemInfo, setSelectedItemInfo] = useState(null);
    const [selectedItemInfoName, setSelectedItemInfoName] = useState(null);
    const [isRecsPopupOpen, setIsRecsPopupOpen] = useState(false);
    const [selectedItemRecs, setSelectedItemRecs] = useState('');


    const debouncedTypeaheadSearch = useCallback(
        debounce(async (query) => {
            if (query.length > 2) { // Only search if the user has typed more than 2 characters
                await fetchTypeAheadRequest(setDropdownData, setResponseText, entryCount, setEntryCount, query, setTitle, setRequestQuery);
            }
        }, 300),
        [] // Dependency array, empty means the debounce function won't change
    );
    const debouncedSearch = useCallback(
        debounce(async (query) => {
            if (query.searchQuery.length > 2) { // Only search if the user has typed more than 2 characters
                await fetchSearchRequest(query.searchQuery, setSearchResults, entryCount, setEntryCount, setTime, setResponseText, time, setRequestQuery);
            }
        }, 300),
        [] // Dependency array, empty means the debounce function won't change
    );

    const debouncedFetchSearchRecs = useCallback(debounce((query, searchRecsType) => {
        fetchSearchRecs(query, searchRecsType);
    }, 300), []);

    useEffect(() => {
        if (recsQuery) {
            debouncedFetchSearchRecs(recsQuery, searchRecsType);
        }
    }, [recsQuery, debouncedFetchSearchRecs]);
    const fetchSearchRecs = async (query, searchRecsType) => {
        setIsLoading(true);
        await fetchSearchRecsRequest(query, setRecsResponse, entryCount, setEntryCount, setTime, setResponseText, time, setRequestQuery, searchRecsType);
        setIsLoading(false);
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        debouncedTypeaheadSearch(value);
    };

    const getSearchResults = async () => {
        setIsLoading(true);
        try {
            await debouncedSearch({searchQuery})
        } catch (error) {
            console.error('Search failed:', error);
        }
        setIsLoading(false);
    };

// Authentication state
    const [auth] = useState({
        login: localStorage.getItem('login'),
        password: localStorage.getItem('password'),
        url: localStorage.getItem('url'),
        pipeline: localStorage.getItem('pipeline'),
        searchProfile: localStorage.getItem('searchProfile'),
        recsProfile: localStorage.getItem('recsProfile'),
    });

    useEffect(() => {
        const { login, password, url, pipeline, searchProfile, recsProfile } = auth;
        localStorage.setItem('login', login);
        localStorage.setItem('password', password);
        localStorage.setItem('url', url);
        localStorage.setItem('pipeline', pipeline);
        localStorage.setItem('searchProfile', searchProfile);
        localStorage.setItem('recsProfile', recsProfile);
    }, [auth]);

    return (
        <div>
            <div className="top_div">
                <AuthForm auth={auth} ></AuthForm>
                <DebugInfo responseText={responseText} requestQuery={requestQuery}></DebugInfo>
            </div>
            <div class="container">
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
                                {dropdownData && title && (
                                    <>
                                        <b className="container-header"> {title}</b>
                                        {dropdownData?.grouped?.type?.groups?.map((group, index) => (
                                            <div key={index} className="group-section">
                                                <div className="group-header">{group.groupValue}</div>
                                                <table>
                                                    <tbody>
                                                    {group.doclist.docs.map((doc, idx) => (
                                                        <tr key={idx}>
                                                            <td onClick={() => {
                                                                setSelectedItemDebugInfo(dropdownData.debug.explain[doc.id]);
                                                                // setSelectedItemName(doc.display_name);
                                                                setIsPopupOpen(true);
                                                            }}>{doc.display_name}</td>
                                                            <td width={150}>{doc.score}</td>
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
                                />
                            </td>

                            {/* Second column for search results */}
                            <td><b>Search</b>
                                {isLoading ? (
                                    <p>Loading...</p>
                                ) : (
                                    searchResults && (
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
                                                        setIsRecsPopupOpen(true);
                                                        setSearchRecsType('productid')
                                                        setRecsQuery(doc.ProductId_l)
                                                        // getSearchRecsResults(doc.ProductId_l)
                                                        // getSearchRecsResults()
                                                        setSelectedItemRecs(doc)
                                                    }
                                                    }>recs
                                                    </td>
                                                    <td onClick={() => {
                                                        setSelectedItemDebugInfo(searchResults.debug.explain[doc.ProductId_l]);
                                                        setIsPopupOpen(true);
                                                    }
                                                    }>debug
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </>
                                ))}

                                <SearchPopup
                                    isSearchPopupOpen={isSearchPopupOpen}
                                    onClose={() => setIsSearchPopupOpen(false)}
                                    selectedItemInfo={selectedItemInfo}
                                    selectedItemInfoName={selectedItemInfoName}
                                />
                                <RecsRequest
                                    isRecsPopupOpen={isRecsPopupOpen}
                                    onClose={() => setIsRecsPopupOpen(false) & setRecsResponse(null) & setSelectedItemRecs(null)}
                                    recsResponse={recsResponse}
                                    sourceItem={selectedItemRecs}
                                    searchRecsType={searchRecsType}
                                    setSearchRecsType = {setSearchRecsType}
                                    isLoading={isLoading}
                                    setRecsQuery={setRecsQuery}
                                    recsQuery={recsQuery}

                                />

                            </td>
                            <td>Fusion debug
                                {dropdownData && (
                                    <JsonView src={dropdownData.responseHeader.params} collapsed={true}
                                              className="custom-json-view"/>

                                )}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>

            </div>

        </div>
    )
        ;
};


export default SearchBar;
