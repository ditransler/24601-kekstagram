'use strict';

(function () {
  var pictures = document.querySelector('.pictures');

  function onPicturesLoad(response) {
    var data = JSON.parse(response);

    window.render(data);

    window.preview.handlePreviewOpening(pictures);

    window.initializeFilters(data, window.render);
  }

  function onPicturesError(err) {
    window.message.showError(err);
  }

  window.backend.load(onPicturesLoad, onPicturesError);
})();
