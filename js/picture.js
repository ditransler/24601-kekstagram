'use strict';

(function () {
  var pictureTemplate = document.querySelector('#picture-template').content;

  function renderPhoto(picture, index) {
    var pictureElem = pictureTemplate.cloneNode(true);
    var pictureTag = pictureElem.querySelector('.picture');
    var pictureIndex = (index < 10) ? '0' + index : index;

    pictureTag.setAttribute('id', 'picture-' + pictureIndex);

    pictureTag.querySelector('img').setAttribute('src', picture.url);

    pictureElem.querySelector('.picture-likes').textContent = picture.likes;

    pictureElem.querySelector('.picture-comments').textContent = picture.comments.length;

    return pictureElem;
  }

  window.picture = {
    renderPhoto: renderPhoto
  };
})();
