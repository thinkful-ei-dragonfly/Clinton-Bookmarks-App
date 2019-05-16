/* eslint-disable no-undef */
// $ global, global bookmarkList FIX

'use strict';

$(function () {
    bookmarkList.bindEventListeners();

    api.getBookmarks()
        .then((bookmarks) => {
            bookmarks.forEach((bookmark) => {
                store.addBookmark(bookmark);
            });
            bookmarkList.render();
        })
        .catch(error => console.log(error.message));
});