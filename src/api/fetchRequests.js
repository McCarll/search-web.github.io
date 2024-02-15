export const fetchSearchRequest = async (query, setSearchResults, entryCount, setEntryCount, setTime, setResponseText,time, setRequestQuery,setFusionDebugData)  => {
    var login = localStorage.getItem('login') || '';
    var password = localStorage.getItem('password') || '';
    var url = localStorage.getItem('url') || '';
    var searchProfile = localStorage.getItem('searchProfile') || '';
    const proxyUrl = 'https://corsproxy.io/?'; // Replace with your actual proxy URL
    const targetUrl = `https://${url}/api/apps/mouser/query/${searchProfile}?q=${query}&debug=results&debug.explain.structured=true&fl=*,score&nocache=${getRandomNumber()}`;
    const encodedCredentials = btoa(`${login}:${password}`);
    const currentTime = new Date();
    const startTime = Date.now(); // Start time in milliseconds
    try {
        const response = await fetch(proxyUrl + targetUrl, {
            method: 'GET',
            cache: 'no-cache',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'Pragma': 'no-cache',
                'Cache-Control': 'max-age=0',
                'Authorization': `Basic ${encodedCredentials}`,
                'Content-type': '*/*',
            }
        });
        if (entryCount > 1_000_000_000) {
            await setEntryCount(0);
        }
        // eslint-disable-next-line no-useless-concat
        setRequestQuery(prev => "search: " + targetUrl.replace(/&nocache=\d+$/, '') + " \n \n" + `${prev}`);
        // setRequestQuery(prev => "search: " + targetUrl.replace(/&nocache=\d+$/, '') + " \n" + `${prev}`);
        if (!response.ok) {
            const errorText = await response.text(); // Get the response text even if the response is not ok
            setResponseText(prevText => `${prevText}${prevText ? '\n' : ''}${entryCount}::${currentTime} ::  Error: ${response.status} - ${errorText}`);
            setEntryCount(entryCount + 1);
            return;
        }


        const data = await response.json();
        setSearchResults(data);
        setFusionDebugData(data.responseHeader);
    } catch (error) {
        console.error('Fetch error:', error);
    } finally {
        const endTime = Date.now();
        const duration = endTime - startTime; // Duration in milliseconds
        setTime(`${duration} ms`);
    }
}

export const  fetchSearchRecsRequest = async (query, setRecsResponse, entryCount, setEntryCount, setTime, setResponseText,time, setRequestQuery, searchType) => {
    const login = localStorage.getItem('login') || '';
    const password = localStorage.getItem('password') || '';
    const url = localStorage.getItem('url') || '';
    const recsProfile = localStorage.getItem('recsProfile') || '';
    const proxyUrl = 'https://corsproxy.io/?'; // Replace with your actual proxy URL
    const targetUrlLog = `https://${url}/api/apps/mouser/query/${recsProfile}?${searchType}=${query}&debug=results&debug.explain.structured=true&fl=*,score&nocache=${getRandomNumber()}`;
    const targetUrl = `https://${url}/api/apps/mouser/query/${recsProfile}?${searchType}=${encodeURIComponent(query)}&debug=results&debug.explain.structured=true&fl=*,score&nocache=${getRandomNumber()}`;
    const encodedCredentials = btoa(`${login}:${password}`);
    const currentTime = new Date();
    const startTime = Date.now(); // Start time in milliseconds
    try {
        const response = await fetch(proxyUrl + targetUrl, {
            method: 'GET',
            cache: 'no-cache',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'Pragma': 'no-cache',
                'Cache-Control': 'max-age=0',
                'Authorization': `Basic ${encodedCredentials}`,
                'Content-type': '*/*',
            }
        });
        if (entryCount > 1_000_000_000) {
            await setEntryCount(0);
        }
        // eslint-disable-next-line no-useless-concat
        setRequestQuery(prev => "recs: " + targetUrlLog.replace(/&nocache=\d+$/, '') + " \n \n" + `${prev}`);
        if (!response.ok) {
            const errorText = await response.text(); // Get the response text even if the response is not ok
            setResponseText(prevText => `${prevText}${prevText ? '\n' : ''}${entryCount}::${currentTime} ::  Error: ${response.status} - ${errorText}`);
            setEntryCount(entryCount + 1);
            return;
        }


        const data = await response.json();
        setRecsResponse(data);
    } catch (error) {
        console.error('Fetch error:', error);
    } finally {
        const endTime = Date.now();
        const duration = endTime - startTime; // Duration in milliseconds
        setTime(`${duration} ms`);
    }
}

export const fetchTypeAheadRequest = async (setDropdownData, setResponseText, entryCount, setEntryCount, searchQuery, setTitle, setRequestQuery,setFusionDebugData) => {

    var login = localStorage.getItem('login') || '';
    var password = localStorage.getItem('password') || '';
    var url = localStorage.getItem('url') || '';
    var pipeline = localStorage.getItem('pipeline') || '';
    const proxyUrl = 'https://corsproxy.io/?'; // Replace with your actual proxy URL

    const targetUrl = `https://${url}/api/apps/mouser/query/${pipeline}?q=${searchQuery}&debug=results&debug.explain.structured=true&fl=*,score&nocache=${getRandomNumber()}`;
    const encodedCredentials = btoa(`${login}:${password}`);
    const currentTime = new Date();
    const startTime = Date.now(); // Start time in milliseconds
    try {
        const response = await fetch(proxyUrl + targetUrl, {
            method: 'GET',
            cache: 'reload',
            headers: {
                'Accept': '*/*',
                'Pragma': 'no-cache',
                'Cache-Control': 'max-age=0',
                'Authorization': `Basic ${encodedCredentials}`,
            }
        });
        // eslint-disable-next-line no-useless-concat
        setRequestQuery(prev => "typeahead: " + targetUrl.replace(/&nocache=\d+$/, '') + " \n \n" + `${prev}`);
        setEntryCount(entryCount + 1);
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
        setFusionDebugData(data.responseHeader);
    } catch (error) {
        console.error('Fetch error:', error);
    } finally {
        const endTime = Date.now();
        const duration = endTime - startTime; // Duration in milliseconds
        setTitle(`${duration} ms`);
    }
}



function getRandomNumber() {
    return Math.floor(Math.random() * 1_000_000_000) + 1;
}
