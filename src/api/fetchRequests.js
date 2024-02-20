export const fetchSearchRequest = async (
    query,
    setSearchResults,
    entryCount,
    setEntryCount,
    setTime,
    time,
    setFusionDebugData,
    updateRequest // Assuming this now handles both adding and updating requests
) => {
    const login = localStorage.getItem('login') || '';
    const password = localStorage.getItem('password') || '';
    const url = localStorage.getItem('url') || '';
    const searchProfile = localStorage.getItem('searchProfile') || '';
    const proxyUrl = 'https://corsproxy.io/?'; // Adjust with your actual proxy URL
    const targetUrl = `https://${url}/api/apps/mouser/query/${searchProfile}?q=${query}&debug=results&debug.explain.structured=true&fl=*,score&nocache=${Math.random()}`;
    const encodedCredentials = btoa(`${login}:${password}`);
    const uniqueRequestId = Date.now(); // Unique ID for the request

    // Add initial request entry with "loading..." placeholders
    updateRequest(uniqueRequestId, {
        queryType: "search",
        url: targetUrl.replace(/&debug=.*$/, ''),
        responseCode: "loading...",
        responseTime: "loading..."
    });

    const startTime = Date.now();
    let response;
    try {
        response = await fetch(proxyUrl + encodeURIComponent(targetUrl), {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${encodedCredentials}`,
                // Include other necessary headers
            }
        });

        const endTime = Date.now();
        const duration = endTime - startTime;

        const data = await response.json();
        setSearchResults(data);
        setFusionDebugData(data.responseHeader);
        setTime(`${duration} ms`);

        // Update the request in state with actual response data
        updateRequest(uniqueRequestId, {
            queryType: "search",
            url: targetUrl.replace(/&debug=.*$/, ''),
            responseCode: response.status,
            responseTime: `${duration} ms`
        });
    } catch (error) {
        console.error('Fetch error:', error);
        // Update the request in state to indicate an error
        updateRequest(uniqueRequestId, {
            queryType: "search",
            url: targetUrl.replace(/&debug=.*$/, ''),
            responseCode: response.status,
            responseTime: `${Date.now() - startTime}`,
            responseErrorCode: `${error}`,
            errorDetails: `${response.statusText}`
        });
    } finally {
        if (entryCount >= 1_000_000_000) {
            await setEntryCount(0); // Reset entry count if it's too high
        }
        setEntryCount((prevCount) => prevCount + 1);
    }
};


export const fetchSearchRecsRequest = async (
    query,
    setRecsResponse,
    entryCount,
    setEntryCount,
    setTime,
    time,
    searchType,
    updateRequest // Use this function to update request entries
) => {
    const login = localStorage.getItem('login') || '';
    const password = localStorage.getItem('password') || '';
    const url = localStorage.getItem('url') || '';
    const recsProfile = localStorage.getItem('recsProfile') || '';
    const proxyUrl = 'https://corsproxy.io/?'; // Adjust with your actual proxy URL
    const targetUrlLog = `https://${url}/api/apps/mouser/query/${recsProfile}?${searchType}=${query}&debug=results&debug.explain.structured=true&fl=*,score&nocache=${Math.random()}`;
    const targetUrl = `https://${url}/api/apps/mouser/query/${recsProfile}?${searchType}=${encodeURIComponent(query)}&debug=results&debug.explain.structured=true&fl=*,score&nocache=${Math.random()}`;
    const encodedCredentials = btoa(`${login}:${password}`);
    const uniqueRequestId = Date.now(); // Unique ID for the request

    // Add initial request entry with "loading..." placeholders
    updateRequest(uniqueRequestId, {
        queryType: "recommendations",
        url: targetUrlLog,
        responseCode: "loading...",
        responseTime: "loading..."
    });

    const startTime = Date.now();
    let response;
    try {
        response = await fetch(proxyUrl + encodeURIComponent(targetUrl), {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${encodedCredentials}`,
                // Include other necessary headers
            }
        });

        const endTime = Date.now();
        const duration = endTime - startTime;


        const data = await response.json();
        setRecsResponse(data);
        setTime(`${duration} ms`);

        // Update the request in state with actual response data
        updateRequest(uniqueRequestId, {
            queryType: "recommendations",
            url: targetUrl.replace(/&debug=.*$/, ''),
            responseCode: response.status,
            responseTime: `${duration} ms`
        });
    } catch (error) {
        console.error('Fetch error:', error);
        // Update the request in state to indicate an error
        updateRequest(uniqueRequestId, {
            queryType: "recommendations",
            url: targetUrl.replace(/&debug=.*$/, ''),
            responseCode: response.status,
            responseTime: `${Date.now() - startTime}`,
            errorDetails: `${response.statusText}`
        });
    } finally {
        if (entryCount >= 1_000_000_000) {
            await setEntryCount(0); // Reset entry count if it's too high
        }
        setEntryCount((prevCount) => prevCount + 1);
    }
};


export const fetchTypeAheadRequest = async (
    setDropdownData,
    entryCount,
    setEntryCount,
    searchQuery,
    setTitle,
    setFusionDebugData,
    updateRequest
) => {
    const login = localStorage.getItem('login') || '';
    const password = localStorage.getItem('password') || '';
    const url = localStorage.getItem('url') || '';
    const pipeline = localStorage.getItem('pipeline') || '';
    const proxyUrl = 'https://corsproxy.io/?'; // Adjust with your actual proxy URL

    const targetUrl = `https://${url}/api/apps/mouser/query/${pipeline}?q=${searchQuery}&debug=results&debug.explain.structured=true&fl=*,score&nocache=${getRandomNumber()}`;
    const encodedCredentials = btoa(`${login}:${password}`);
    const uniqueRequestId = Date.now(); // Unique ID for the request

    // Add initial request with "loading..." placeholders
    updateRequest(uniqueRequestId, {
        queryType: "typeahead",
        url: targetUrl.replace(/&debug=.*$/, ''),
        responseCode: "loading...",
        responseTime: "loading..."
    });

    const startTime = Date.now();
    let response;

    try {
        response = await fetch(proxyUrl + encodeURIComponent(targetUrl), {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${encodedCredentials}`,
                // Include other necessary headers
            }
        });

        const endTime = Date.now();
        const duration = endTime - startTime;
        const data = await response.json();

        // Update dropdown, debug data, etc.
        setDropdownData(data);
        setFusionDebugData(data.responseHeader);
        setTitle(`${duration} ms`);

        // Update the request in state with actual response data
        updateRequest(uniqueRequestId, {
            queryType: "typeahead",
            url: targetUrl.replace(/&debug=.*$/, ''),
            responseCode: response.status,
            responseTime: `${duration} ms`
        });
    } catch (error) {
        console.error('Fetch error:', error);

        updateRequest(uniqueRequestId, {
            queryType: "typeahead",
            url: targetUrl.replace(/&debug=.*$/, ''),
            responseCode: response.status,
            responseTime: `${Date.now() - startTime}`,
            errorDetails: `${response.statusText}`
        });
    }
};


function getRandomNumber() {
    return Math.floor(Math.random() * 1_000_000_000) + 1;
}
