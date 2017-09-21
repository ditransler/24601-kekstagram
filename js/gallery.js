'use strict';

(function () {
  var pictures = [];
  var picturesList = document.querySelector('.pictures');

  function onPicturesLoad(data) {
    pictures = data.map(function (item) {
      return new window.Picture(item);
    });

    window.render(pictures);

    window.preview.handlePreviewOpening();

    window.initializeFilters();
  }

  function onPicturesError(err) {
    window.message.showError(err);
  }

  window.backend.load(onPicturesLoad, onPicturesError);

  window.gallery = {
    container: picturesList,
    get pictures() {
      return pictures;
    }
  };
})();
