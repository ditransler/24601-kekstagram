'use strict';

(function () {
  var pictures = document.querySelector('.pictures');

  function addPhotoToPictures(items, target) {
    var fragment = document.createDocumentFragment();

    items.forEach(function (item) {
      fragment.appendChild(window.picture.renderPhoto(item));
    });

    target.appendChild(fragment);
  }

  function onPicturesLoad(response) {
    var data = JSON.parse(response);

    addPhotoToPictures(data, pictures);

    window.preview.handlePreviewOpening(pictures);
  }

  function onPicturesError() {
    return false;
  }

  window.backend.load(onPicturesLoad, onPicturesError);
})();
