/* global Bookmark */

'use strict';

// eslint-disable-next-line no-unused-vars
const store = (function () {

    const addBookmark = function (dataResponse) {

        try {
            this.bookmarks.push({
                id: dataResponse.id,
                title: dataResponse.title,
                rating: dataResponse.rating,
                url: dataResponse.url,
                desc: dataResponse.desc,
                isDisplayDetailed: false,
            });

        } catch (e) {
            console.log(e.message);
        }
    };

    const findById = function (id) {
        return this.bookmarks.find(bookmark => bookmark.id === id);
    };

    const findAndToggleDetailed = function (id) {
        const bookmark = this.findById(id);
        bookmark.isDisplayDetailed = !bookmark.isDisplayDetailed;
    };

    const findAndDelete = function (id) {
        this.bookmarks = this.bookmarks.filter(bookmark => bookmark.id !== id);
    };

    const setError = function (errorMessage) {
        if (errorMessage === null) {
            this.error = null;
        } else {
            this.error = errorMessage.message;
        }
    };

    return {
        bookmarks: [],
        isDisplayDetailed: false,
        error: null,
        filterValue: '0',

        setError,
        addBookmark,
        findById,
        findAndToggleDetailed,
        findAndDelete,

    };

}());