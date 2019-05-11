// eslint-disable-next-line no-unused-vars
const api = (function () {
    const BASE_URL = 'https://thinkful-list-api.herokuapp.com/clinton/bookmarks';

    const getItems = function() {
        return fetch(BASE_URL)
            // eslint-disable-next-line indent
        .then(response => response);
    }

    const createItems = function(bookmark) {
        const newBookmark = JSON.stringify(bookmark);
        const options = {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: newBookmark,
        };
        return fetch(BASE_URL, options)
            .then(response => response);
    };

    function deleteItems(id) {
        const options = {
            method: 'DELETE',
        };
        return fetch(`${BASE_URL}/${id}`, options)
            .then(response => response);
    };

    return {
        getItems,
        createItems,
        deleteItems,
    };
})();
