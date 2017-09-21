'use strict';

(function () {
  var pictureTemplate = document.querySelector('#picture-template').content;
  var picturesList = document.querySelector('.pictures');

  function createPicture(picture) {
    var pictureElem = pictureTemplate.cloneNode(true);
    var pictureTag = pictureElem.querySelector('.picture');

    pictureTag.setAttribute('id', picture.id);

    pictureTag.querySelector('img').setAttribute('src', picture.url);

    pictureElem.querySelector('.picture-likes').textContent = picture.likes;

    pictureElem.querySelector('.picture-comments').textContent = picture.comments.length;

    return pictureElem;
  }

  window.render = function (data) {
    var fragment = document.createDocumentFragment();

    data.forEach(function (item) {
      fragment.appendChild(createPicture(item));
    });

    picturesList.innerHTML = '';
    picturesList.appendChild(fragment);
  };
})();
