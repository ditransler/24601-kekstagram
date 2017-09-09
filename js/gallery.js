'use strict';

(function () {
  var pictures = document.querySelector('.pictures');

  function addPhotosToPictures(items) {
    var fragment = document.createDocumentFragment();

    items.forEach(function (item) {
      fragment.appendChild(window.picture.renderPhoto(item));
    });

    pictures.innerHTML = '';
    pictures.appendChild(fragment);
  }

  function onPicturesLoad(response) {
    var data = JSON.parse(response);

    addPhotosToPictures(data);

    window.preview.handlePreviewOpening(pictures);

    window.initializeFilters(data, addPhotosToPictures);
  }

  function onPicturesError(err) {
    window.message.showError(err);
  }

  window.backend.load(onPicturesLoad, onPicturesError);
})();
