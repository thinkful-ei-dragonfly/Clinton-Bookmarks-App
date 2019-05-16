// eslint-disable-next-line no-unused-vars

'use strict';

const api = (function () {

    // base URL for bookmarks server end point
    const BASE_URL = 'https://thinkful-list-api.herokuapp.com/Clinton/bookmarks';
 
    function fetchHandler(...params) {
        let error;
        return fetch(...params)
            .then(response => {
                if (!response.ok) {
                    error = { code: response.status };
                    if (!response.headers.get('content-type').includes('json')) {
                        error.message = response.statusText;
                        return Promise.reject(error);
                    }
                }
                return response.json();
            })
            .then(data => {
                if (error) {
                    error.message = data.message;
                    return Promise.reject(error);
                }
                return data;
            });
    }

    function getBookmarks() {
        return fetchHandler(BASE_URL);
    }

    function createBookmark(newObj) {

        const headersObj = new Headers({
            'content-type': 'application/json',
        });

        const postBookmarkURL = BASE_URL;
        const body = JSON.stringify(newObj);

        return fetchHandler(postBookmarkURL, {
            method: 'POST',
            headers: headersObj,
            body,
        });
    }

    function deleteBookmark(id) {

        try {
            return fetchHandler(BASE_URL + '/' + id, { method: 'DELETE' }); 
        } catch (e) {
            console.log(e.message);
        }


    }

    return {
        getBookmarks,
        createBookmark,
        deleteBookmark,
    };


})();