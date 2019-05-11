/* global $, index, api, store */
// eslint-disable-next-line no-unused-vars

const bookmark = (function () {
    function generateBookmarkItem(bookmark) {
        let bookmarkItem = `
    <li class="js-bookmark-element" data-bookmark-id="${bookmark.id}">
    <span class="bookmark-item">${bookmark.title}</span> 
    <div>${bookmark.rating} stars</div>
    <button id="bookmark-expand"class="bookmark-expand js-bookmark-expand">
      <span class="button-label">Expand</span>
    </button>
    <button class="bookmark-delete js-bookmark-delete">
      <span class="button-label">Delete</span>
    </button>
    </li>`;


        if (bookmark.expanded) {
            bookmarkItem = `<li class="js-bookmark-element" data-bookmark-id="${bookmark.id}">
      <span class="bookmark-item">${bookmark.title}</span>
      <div>${bookmark.desc}</div>
      <a id="bookmark-link" class="bookmark-link js-bookmark-link" href="${bookmark.url}" target="_blank">
        <span class="button-label">Visit Site</span>
      </a>
      <div>${bookmark.rating} stars</div>
        <button id="bookmark-expand-close" class="js-bookmark-expand js-bookmark-expand-close">
          <span class="button-label">Close</span>
        </button>
        <button class="bookmark-delete js-bookmark-delete">
          <span class="button-label">Delete</span>
        </button>
        </li>`;
        }

        return bookmarkItem;

    }

    function generateBookmarkString(bookmarks) {
        const bookmarkArray = bookmarks.map(bookmark => generateBookmarkItem(bookmark));
        return bookmarkArray.join('');
    }

    function render(){
        let bookmarks = [...store.bookmarks];
        if (store.addingNew) {
            $('#js-add-new-bookmark').removeClass('hidden');
            $('#js-add-button').addClass('hidden');
            $('#js-rating-filter').addClass('hidden');
        }
        else {
            $('#js-add-new-bookmark').addClass('hidden');
            $('#js-add-button').removeClass('hidden');
            $('#js-rating-filter').removeClass('hidden');
        }

        if (store.error !== null) {
            $('p').removeClass('hidden');
        }
        else {
            $('p').addClass('hidden');
        }
        const filteredBookmarks = bookmarks.filter(bookmark => bookmark.rating >= store.ratingFilter);
        const htmlString = generateBookmarkString(filteredBookmarks);
        $('.js-bookmark-list').html(htmlString);
    }
    
    function handleOpenAddForm() {
        $('#js-add-button').click(event => {
            event.preventDefault();
            if(store.addingNew === false){
                store.toggleAddNew();
            }
            render();
        })
    }
    
    function handleAddFormCancel() {
        $('#js-add-bookmark-form').on('reset', '#js-add-bookmark', event => {
            event.preventDefault();
            store.addingNew = false;
            store.error = null;
            render();
        })
    }
    
    function handleAddBookmark() {
        $('#js-add-bookmark-form').on('submit', '#js-add-bookmark', event => {
            event.preventDefault();
            const title = $('js-title').val();
            const url = $('js-url').val();
            const rating = $('#js-rating-input').val();
            const description = $('#js-description').val();

            $('#js-title').val('');
            $('#js-url').val('');
            $('#js-rating-input').val('Minimum rating');
            $('#js-description').val('');
            
            const bookmark = {
                title,
                url,
                rating,
                description,
                expanded: false,
            };
            api.createItems(bookmark)
                .then(newBookmark => {
                    if (newBookmark.message){
                        store.updateError('Bookmark cannot be submitted');
                    }
                    else  {
                        store.addBookmark(newBookmark);
                        store.addingNew = false;
                        store.updateError(null);
                    }
                    render();
                });
        });
    }

    function getBookmarkIdFromElement(bookmark) {
        return $(bookmark)
            .closest('.js-bookmark-element')
            .data('bookmark-id');
    }
    
    function handleDeleteBookmark() {
        $('.js-bookmark-list').on('click', '#js-bookmark-delete', event => {
            const id = $(event.currentTarget).closest('.bookmark-display').find('.js-bookmark').attr('data-book-id');
            let error = '';
            api.deleteBookmark(id)
                .then(() => {
                    store.findAndDelete(id);
                    render();
                });
        });
    }
    
    function handleFilterClick() {
        $('#js-rating-filter').change(event => {
            const val = $(event.currentTarget).val();
            store.changeRatingFilter(val);
            render();
        });
    }
    
    function handleExpandClick() {
        $('.js-bookmark-list').on('click', '.js-bookmark-expand', event => {
            const id = getBookmarkIdFromElement(event.target);
            store.toggleExpanded(id);
            render();
        });
    }

    function bindEventListeners() {
        handleOpenAddForm();
        handleAddFormCancel();
        handleAddBookmark();
        handleDeleteBookmark();
        handleFilterClick();
        handleExpandClick();
    }

    return {
        render,
        bindEventListeners,
    };
}());

