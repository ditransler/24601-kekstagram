'use strict';

(function () {
  var galleryOverlay = document.querySelector('.gallery-overlay');
  var galleryOverlayClose = galleryOverlay.querySelector('.gallery-overlay-close');

  function closeGalleryOverlay() {
    document.removeEventListener('keydown', onGalleryOverlayEscPress);
    document.querySelector(galleryOverlay.dataset['returnFocus']).focus();
    galleryOverlay.classList.add('hidden');
    document.body.classList.remove('is-overlay-opened');
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

  function openGalleryOverlay(pictureId) {
    var picture = window.gallery.pictures.find(function (item) {
      return item.id === pictureId;
    });

    galleryOverlay.querySelector('.gallery-overlay-image').setAttribute('src', picture.url);

    var galleryComments = galleryOverlay.querySelector('.comments-count');
    galleryComments.textContent = picture.comments.length;
    galleryComments.nextSibling.textContent = galleryComments.nextSibling.textContent
      .replace(/(комментари)[а-я]{1,3}/i, function (match, p1) {
        return p1 + window.util.getNounEnding(picture.comments.length, 'й', 'я', 'ев');
      });

    galleryOverlay.querySelector('.likes-count').textContent = picture.likes;

    document.addEventListener('keydown', onGalleryOverlayEscPress);

    galleryOverlay.dataset['returnFocus'] = '#' + picture.id;

    galleryOverlay.classList.remove('hidden');
    document.body.classList.add('is-overlay-opened');
    galleryOverlay.focus();
  }

  function handleGallaryOverlayOpening() {
    window.gallery.container.addEventListener('click', function onPictureClick(evt) {
      var picture = evt.target.closest('.picture');

      if (!picture) {
        return;
      }

      evt.preventDefault();

      openGalleryOverlay(picture.getAttribute('id'));
    });

    window.gallery.container.addEventListener('keydown', function onPictureEnterPress(evt) {
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

  galleryOverlayClose.addEventListener('click', closeGalleryOverlay);

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
