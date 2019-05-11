/* global $, bookmarks, api, store */

function main() {
    bookmark.bindEventListeners();
    let error = '';
    api.getItems()
        .then(res => {
            if (!res.ok) {
                error = { code: res.status };
            }
            return res.json();
        })
        .then(res => {
            if (error) {
                error.message = res.message;
                return Promise.reject(error);
            }
            res.forEach(bookmark => store.addBookmark(bookmark));
            bookmark.render();
        })
        .catch(e => {
            store.updateError(e);
            bookmark.render();
        });
    // api.getItems()
    //     .then(bookmarks => {
    //         bookmarks.foreach(bookmark => store.addBookmark(bookmark));
    //         bookmark.render();
    //     });
    //     bookmark.bindEventListeners();
}

$(main);