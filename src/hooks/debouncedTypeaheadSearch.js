import {useCallback} from "react";
import {fetchTypeAheadRequest} from "../api/fetchRequests";
import debounce from 'lodash.debounce';

export const debouncedTypeaheadSearch = useCallback(

    debounce(async (query) => {
        if (query.length > 2) { // Only search if the user has typed more than 2 characters
            await fetchTypeAheadRequest(setDropdownData, setResponseText, entryCount, setEntryCount, query, setTitle, setRequestQuery);
        }
    }, 300),
    [] // Dependency array, empty means the debounce function won't change


);
