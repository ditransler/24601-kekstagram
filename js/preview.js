'use strict';

(function () {
  var galleryOverlay = document.querySelector('.gallery-overlay');
  var galleryOverlayClose = galleryOverlay.querySelector('.gallery-overlay-close');

  function closeGalleryOverlay() {
    document.removeEventListener('keydown', onGalleryOverlayEscPress);
    document.querySelector(galleryOverlay.dataset['returnFocus']).focus();
    galleryOverlay.classList.add('hidden');
    document.body.classList.add('is-overlay-opened');
  }

  function onGalleryOverlayEscPress(evt) {
    if (!window.util.isEscKey(evt)) {
      return;
    }

    if (galleryOverlay.classList.contains('hidden')) {
      return;
    }

    closeGalleryOverlay();
  }

  function openGalleryOverlay(picture) {
    var pictureUrl = picture.querySelector('img').getAttribute('src');
    var pictureComments = picture.querySelector('.picture-comments').textContent;
    var pictureLikes = picture.querySelector('.picture-likes').textContent;

    var galleryComments = galleryOverlay.querySelector('.comments-count');

    galleryOverlay.querySelector('.gallery-overlay-image').setAttribute('src', pictureUrl);

    galleryComments.textContent = pictureComments;
    galleryComments.nextSibling.textContent = galleryComments.nextSibling.textContent
      .replace(/(комментари)[а-я]{1,3}/i, function (match, p1) {
        return p1 + window.util.getNounEnding(+pictureComments, 'й', 'я', 'ев');
      });

    galleryOverlay.querySelector('.likes-count').textContent = pictureLikes;

    document.addEventListener('keydown', onGalleryOverlayEscPress);

    galleryOverlay.dataset['returnFocus'] = '#' + picture.getAttribute('id');

    galleryOverlay.classList.remove('hidden');
    document.body.classList.add('is-overlay-opened');
    galleryOverlay.focus();
  }

  function handleGallaryOverlayOpening(container) {
    container.addEventListener('click', function onPictureClick(evt) {
      var picture = evt.target.closest('.picture');

      if (!picture) {
        return;
      }

      evt.preventDefault();

      openGalleryOverlay(picture);
    });

    container.addEventListener('keydown', function onPictureEnterPress(evt) {
      var picture = evt.target.closest('.picture');

      if (!window.util.isEnterKey(evt)) {
        return;
      }

      if (!picture) {
        return;
      }

      evt.preventDefault();

      openGalleryOverlay(picture);
    });
  }

  galleryOverlayClose.addEventListener('click', function onGalleryOverlayCloseClick(evt) {
    galleryOverlay.classList.add('hidden');
  });

  galleryOverlayClose.addEventListener('keydown', function onGalleryOverlayCloseEnterPress(evt) {
    if (!window.util.isEnterKey(evt)) {
      return;
    }

    closeGalleryOverlay();
  });

  window.preview = {
    handlePreviewOpening: handleGallaryOverlayOpening
  };
})();
