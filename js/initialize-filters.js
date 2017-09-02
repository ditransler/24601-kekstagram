'use strict';

(function () {
  window.initializeFilters = function (filtersContainer, filterElem, applyFilter) {
    filtersContainer.addEventListener('change', function onEffectControlsChange(evt) {
      if (evt.target.name !== 'effect') {
        return;
      }

      applyFilter(filterElem, evt.target.value, filterElem.dataset.effect);
    });
  };
})();
