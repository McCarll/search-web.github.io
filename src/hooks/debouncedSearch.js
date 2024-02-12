import {useCallback} from "react";
import {fetchSearchRequest} from "../api/fetchRequests";
import debounce from 'lodash.debounce';

export const  debouncedSearch = useCallback(
    debounce(async (query) => {
        if (query.searchQuery.length > 2) { // Only search if the user has typed more than 2 characters
            await fetchSearchRequest(query.searchQuery, setSearchResults, entryCount, setEntryCount, setTime, setResponseText, time, setRequestQuery);
        }
    }, 300),
    [] // Dependency array, empty means the debounce function won't change
);