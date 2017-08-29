'use strict';

var pictures = document.querySelector('.pictures');
var generatedPictures = window.data.generatePictures();

function addPhotoToPictures(items, target) {
  var fragment = document.createDocumentFragment();

  items.forEach(function (item) {
    fragment.appendChild(window.picture.renderPhoto(item));
  });

  target.appendChild(fragment);
}

addPhotoToPictures(generatedPictures, pictures);

window.preview.handlePreviewOpening(pictures);
