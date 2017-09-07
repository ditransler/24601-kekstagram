'use strict';

(function () {
  var filters = document.querySelector('.filters');
  var currentFilter = '';

  function onFiltersChange(evt) {
    if (!evt.target.classList.contains('filters-radio')) {
      return;
    }

    currentFilter = evt.target.value;
  }

  window.initializeFilters = function () {
    filters.addEventListener('change', onFiltersChange);

    filters.classList.remove('hidden');
  };
})();
