'use strict';

// individual bookmark module 
// only allows access to create bookmark and validate bookmark */
const Bookmark = (function Bookmark() {

    function createBookmark(id, title, rating, url, desc) {
        return {
            id,
            title,
            rating,
            url,
            desc,
            isDisplayDetailed: false, 
        };
    }

    function validateBookmarkLegality(title, rating, link, description, id) {

        if (!rating && rating !== 0 && !link && !description) {
            return false;
        }
        return true;

    }


    return {
        validateBookmarkLegality,
        createBookmark,
    };


})();