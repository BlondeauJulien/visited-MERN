import { useState, useCallback, useRef, useEffect } from 'react';
//useCallback here is used to avoid infinite loop so this function never get re created when the component that use the hook rerender

export const useHttpClient = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const activeHttpRequests = useRef([]);
    // a reference here is juust a piece of data that will not change (or in this case no be re initialize when this function run again)
    // We could say it store data across re render cycle

    const sendRequest = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
        setIsLoading(true)
        const httpAbortCtrl = new AbortController(); // this is an api supported in modern browsers
        activeHttpRequests.current.push(httpAbortCtrl);

        try {
            const response = await fetch(url, {
                method, 
                body,
                headers,
                signal: httpAbortCtrl.signal
                // This link our aboardcontroler to this request and now we can use this aboard controler to cancel this request
            }, );
            const responseData = await response.json();

            activeHttpRequests.current =activeHttpRequests.current.filter(reqCtrl => reqCtrl !== httpAbortCtrl)

            if (!response.ok) {
                //It's a property from the response object from fetch
                // it will be falsy for any 400 or 500 code response
                throw new Error(responseData.message); // all of our error response got a message
            }
            setIsLoading(false);
            return responseData;
        } catch (err) {
            setError(err.message || 'Something went wrong, please try again.');
            setIsLoading(false);
            throw err;
        }
    }, []);

    const clearError = () => {
        setError(null)
    }

    useEffect(() => {
        return () => {
            activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort())
        }
        // when we return a function it is used as a clean up before useEffect the next time useEfeect runs again or when the component that use our custom hook unmoont
    }, [])

    return { isLoading, error, sendRequest, clearError}
}