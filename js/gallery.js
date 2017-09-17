'use strict';

(function () {
  var pictures = [];
  var picturesList = document.querySelector('.pictures');

  function onPicturesLoad(data) {
    pictures = data.map(function (item) {
      return new window.Picture(item);
    });

    window.render(pictures);

    window.preview.handlePreviewOpening(picturesList);

    window.initializeFilters(pictures, window.render);
  }

  function onPicturesError(err) {
    window.message.showError(err);
  }

  window.backend.load(onPicturesLoad, onPicturesError);
})();
