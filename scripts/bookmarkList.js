/* eslint-disable no-undef */
// global $

'use strict';


/* global store, api, $ */

// eslint-disable-next-line no-unused-vars
const bookmarkList = (function () {

    function generateError(message) {
        return `
      <section class="error-content">
        <button id="cancel-error">X</button>
        <p>${message}</p>
      </section>
    `;
    }



    function generateBookmarkElement(bookmark) {

        let hideRatingOptionClass = '';
        let hideDescOptionClass = '';
        if (bookmark.rating === null) {
            hideRatingOptionClass = 'hide-field';
        }

        if (bookmark.desc === null) {
            hideDescOptionClass = 'hide-field';
        }
        let expandButton = '<button class="js-expand-button">Details</button>';
        let deleteButton = '<button class="js-delete-button">Delete</button>';

        let bookmarkString = `<div class="bookmark-container" data-bookmark-id="${bookmark.id}">`;
        if (bookmark.isDisplayDetailed) {
            bookmarkString +=
                `<li class="js-detailed-bookmark">
          <p>${bookmark.title}</p>
          <p class="${hideRatingOptionClass}">${bookmark.rating} Star</p>
          <p class="${hideDescOptionClass}">${bookmark.desc}</p>
          <p><a href="${bookmark.url}">Visit Site</a></p>
        </li>`;
        } else {
            bookmarkString +=
                `<li class="js-undetailed-bookmark">
            <p>${bookmark.title}</p>
            <p class="${hideRatingOptionClass}">${bookmark.rating} Star</p>
          </li>`;
        }
        bookmarkString += `<div class="js-bookmark-buttons" data-bookmark-id="${bookmark.id}">`;
        bookmarkString += expandButton;
        bookmarkString += deleteButton;
        bookmarkString += '</div>';
        return bookmarkString += '</div>';
    }


    function generateBookmarkListString(bookmarkList) {
        const bookmarks = bookmarkList.map((bookmark) => generateBookmarkElement(bookmark));
        return bookmarks.join('');
    }

    function renderError() {
        if (store.error) {
            const el = generateError(store.error);
            $('.error-container').html(el);
        } else {
            $('.error-container').empty();
        }
    }

    function render() {
        renderError(); 
        let bookmarks = [...store.bookmarks];
        if (store.filterValue !== '0') {
            bookmarks = bookmarks.filter(bookmark => bookmark.rating >= store.filterValue);
        }
        const bookmarkListString = generateBookmarkListString(bookmarks);

        $('.js-bookmark-list').html(bookmarkListString);
    }


    function handleNewBookmarkSubmit() {
        $('#js-myForm').submit(function (e) {
            e.preventDefault();
            const title = e.target.title.value;
            const url = e.target.url.value;
            const desc = e.target.desc.value;
            const rating = e.target.rating.value;

            const newObj = {};
            if (desc !== "") {
                newObj['desc'] = desc;
            }
            if (rating !== "") {
                newObj['rating'] = rating;
            }

            newObj['title'] = title;
            newObj['url'] = url;

            api.createBookmark(newObj)
                .then((newBookmark) => {
                    store.addBookmark(newBookmark);
                    render();
                })
                .catch((err) => {
                    store.setError(err); 
                    renderError();
                });
        });
    } 
    function handleToggleDetailed() {
        $('.js-bookmark-list').on('click', '.js-expand-button', event => {
            const id = $(event.currentTarget).closest('.js-bookmark-buttons').attr('data-bookmark-id');
            store.findAndToggleDetailed(id);
            render();
        });
    }

    function handleDeleteBookmarkClicked() {
        $('.js-bookmark-list').on('click', '.js-delete-button', event => {
            const id = $(event.currentTarget).closest('.js-bookmark-buttons').attr('data-bookmark-id');

            api.deleteBookmark(id)
                .then(response => {       // was just () =>
                    store.findAndDelete(id);
                    render();
                })
                .catch((err) => {
                    console.log(err);
                    store.setError(err.message);
                    renderError();
                }
                );
        });
    }

    function handleToggleFilter() {
        $('#js-filter-rating').change(event => {
            store.filterValue = event.currentTarget.filterRating.value;
            // store.toggleCheckedFilter();
            render();
        });
    }

    function handleCloseError() {
        $('.error-container').on('click', '#cancel-error', () => {
            store.setError(null);
            renderError();
        });
    }


    function bindEventListeners() {
        handleNewBookmarkSubmit();
        handleToggleDetailed();
        handleDeleteBookmarkClicked();
        handleToggleFilter();
        handleCloseError();
    }

    return {
        render,
        bindEventListeners,
    };

})();