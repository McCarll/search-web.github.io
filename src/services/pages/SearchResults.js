import React, {useCallback, useState} from 'react';
import '../../assets/styles/SearchBar.css';
import Popup from "./Popup";
import SearchPopup from "./SearchPopup";
import RecsRequest from "./RecsRequest";
import JsonView from "react18-json-view";
import debounce from 'lodash.debounce';
import {fetchSearchRecsRequest} from "../../api/fetchRequests";

const SearchResults = ({ dropdownData, title, isLoading,searchResults,setResponseText,setRequestQuery }) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isSearchPopupOpen, setIsSearchPopupOpen] = useState(false);
    const [isRecsPopupOpen, setIsRecsPopupOpen] = useState(false);
    const [selectedItemDebugInfo, setSelectedItemDebugInfo] = useState(null);

    const [selectedItemInfo, setSelectedItemInfo] = useState(null);
    const [selectedItemInfoName, setSelectedItemInfoName] = useState(null);

    const [recsResponse, setRecsResponse] = useState('');
    const [selectedItemRecs, setSelectedItemRecs] = useState('');
    const [entryCount, setEntryCount] = useState(0);
    const [time, setTime] = useState('Search time');


    const getSearchRecsResults = (e) => {
        console.log("getSearchRecResults:: " + e);
        debouncedRecsSearch(e);
    };
    const debouncedRecsSearch = useCallback(
        debounce(async (query) => {
            await fetchSearchRecsRequest(query, setRecsResponse, entryCount, setEntryCount, setTime, setResponseText, time, setRequestQuery);
        }, 300),
        [] // Dependency array, empty means the debounce function won't change
    );
    return (<div className="table-container">
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
                                                getSearchRecsResults(doc.ProductId_l)
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
    </div>);
};

export default SearchResults;
