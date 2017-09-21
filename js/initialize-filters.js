'use strict';

(function () {
  var filters = document.querySelector('.filters');
  var FILTER_NAMES = {
    popular: 0,
    discussed: 1,
    random: 2,
    recommend: 3
  };

  function filterData(name) {
    var filterValue = FILTER_NAMES[name];

    if (filterValue === FILTER_NAMES.recommend) {
      return window.gallery.pictures;
    }

    var data = window.gallery.pictures.slice();

    switch (filterValue) {
      case FILTER_NAMES.popular:
        return data.sort(function (left, right) {
          return right.likes - left.likes;
        });
      case FILTER_NAMES.discussed:
        return data.sort(function (left, right) {
          return right.comments.length - left.comments.length;
        });
      case FILTER_NAMES.random:
        return window.util.shuffleArray(data);
      default:
        return window.gallery.pictures;
    }
  }

  function onFiltersChange(evt) {
    if (!evt.target.classList.contains('filters-radio')) {
      return;
    }

    window.util.debounce(window.render.bind(null, filterData(evt.target.value)));
  }

  window.initializeFilters = function () {
    filters.addEventListener('change', onFiltersChange);

    filters.classList.remove('hidden');
  };
})();
