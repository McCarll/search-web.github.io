import React from 'react';
import debounce from 'lodash.debounce';
import '../../assets/styles/SearchBar.css';

const SearchInput = ({ searchQuery, setSearchQuery, fetchTypeAheadRequest, fetchSearchRequest, auth, setResponseText, setEntryCount }) => {
    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        debouncedTypeaheadSearch(value);
    };

    const debouncedTypeaheadSearch = debounce((query) => {
        if (query.length > 2) {
            fetchTypeAheadRequest(auth, query, setResponseText, setEntryCount);
        }
    }, 300);

    const handleSearchSubmit = () => {
        if (searchQuery.length > 2) {
            fetchSearchRequest(auth, searchQuery, setResponseText, setEntryCount);
        }
    };

    return (
        <div className="search-input">
            <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search..."
            />
            <button onClick={handleSearchSubmit}>Search</button>
        </div>
    );
};

export default SearchInput;
