'use strict';

(function () {
  var filters = document.querySelector('.filters');
  var FILTER_NAMES = {
    popular: 0,
    discussed: 1,
    random: 2,
    recommend: 3
  };
  var initialData = null;

  function filterData(name) {
    var filterValue = FILTER_NAMES[name];

    if (filterValue === FILTER_NAMES.recommend) {
      return initialData;
    }

    var data = initialData.slice();

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
        return initialData;
    }
  }

  function onFiltersChange(rerender, evt) {
    if (!evt.target.classList.contains('filters-radio')) {
      return;
    }

    window.debounce(rerender.bind(null, filterData(evt.target.value)));
  }

  window.initializeFilters = function (data, cb) {
    initialData = data;

    filters.addEventListener('change', onFiltersChange.bind(null, cb));

    filters.classList.remove('hidden');
  };
})();
