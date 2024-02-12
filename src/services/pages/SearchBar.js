import '../../assets/styles/SearchBar.css';
import debounce from 'lodash.debounce';
import {useCallback, useEffect, useState} from "react";
import 'react18-json-view/src/style.css';
import '../../assets/styles/TreeView.css';
import AuthForm from "./AuthForm";
import DebugInfo from "./DebugInfo";

import {fetchSearchRequest, fetchTypeAheadRequest} from "../../api/fetchRequests";
import SearchResults from "./SearchResults";
import {debouncedTypeaheadSearch, debouncedSearch} from "../../hooks/debounces"


const SearchBar = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [responseText, setResponseText] = useState('');
    const [entryCount, setEntryCount] = useState(0);
    const [dropdownData, setDropdownData] = useState(null);
    const [title, setTitle] = useState('Type ahead menu');
    const [time, setTime] = useState('Search time');
    const [isLoading, setIsLoading] = useState(false);
    const [searchResults, setSearchResults] = useState(null);
    const [requestQuery, setRequestQuery] = useState('');



    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        debouncedTypeaheadSearch(value);
    };

    const getSearchResults = async () => {
        setIsLoading(true);
        // Perform the search. This is a simplified example; you'll need to implement actual search logic.
        try {
            await debouncedSearch({searchQuery})
        } catch (error) {
            console.error('Search failed:', error);
            // Handle the error accordingly
        }
        setIsLoading(false);
    };
// Authentication state
    const [auth, setAuth] = useState({
        login: localStorage.getItem('login'),
        password: localStorage.getItem('password'),
        url: localStorage.getItem('url'),
        pipeline: localStorage.getItem('pipeline'),
        searchProfile: localStorage.getItem('searchProfile'),
        recsProfile: localStorage.getItem('recsProfile'),
    });

    useEffect(() => {
        const {login, password, url, pipeline, searchProfile, recsProfile} = auth;
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
                <AuthForm auth={auth} setAuth={setAuth}></AuthForm>
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
                <SearchResults dropdownData={dropdownData}
                               title={title}
                               isLoading={isLoading}
                               searchResults={searchResults}
                               setResponseText={setResponseText}
                               setRequestQuery={setRequestQuery}
                >

                </SearchResults>

            </div>

        </div>
    )
        ;
};


export default SearchBar;
