'use strict';

function renderPhoto(picture, template) {
  var pictureElem = template.cloneNode(true);
  var pictureTag = pictureElem.querySelector('.picture');

  pictureTag.setAttribute('id', picture.id);

  pictureTag.querySelector('img').setAttribute('src', picture.url);

  pictureElem.querySelector('.picture-likes').textContent = picture.likes;

  pictureElem.querySelector('.picture-comments').textContent = picture.comments.length;

  return pictureElem;
}

function addPhotoToPictures(pictures, target, template) {
  var fragment = document.createDocumentFragment();

  pictures.forEach(function (picture) {
    fragment.appendChild(renderPhoto(picture, template));
  });

  target.appendChild(fragment);
}

function closeGalleryOverlay() {
  document.removeEventListener('keydown', onGalleryOverlayEscPress);
  document.querySelector(galleryOverlay.dataset['returnFocus']).focus();
  galleryOverlay.classList.add('hidden');
}

function onGalleryOverlayEscPress(evt) {
  if (!window.util.isEscKey()) {
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
  galleryOverlay.focus();
}

var pictureTemplate = document.querySelector('#picture-template').content;
var pictures = document.querySelector('.pictures');

var generatedPictures = window.data.generatePictures();

addPhotoToPictures(generatedPictures, pictures, pictureTemplate);

var galleryOverlay = document.querySelector('.gallery-overlay');
var galleryOverlayClose = galleryOverlay.querySelector('.gallery-overlay-close');

pictures.addEventListener('click', function onPictureClick(evt) {
  var picture = evt.target.closest('.picture');

  if (!picture) {
    return;
  }

  evt.preventDefault();

  openGalleryOverlay(picture);
});

pictures.addEventListener('keydown', function onPictureEnterPress(evt) {
  var picture = evt.target.closest('.picture');

  if (!window.util.isEnterKey()) {
    return;
  }

  if (!picture) {
    return;
  }

  evt.preventDefault();

  openGalleryOverlay(picture);
});

galleryOverlayClose.addEventListener('click', function onGalleryOverlayCloseClick(evt) {
  galleryOverlay.classList.add('hidden');
});

galleryOverlayClose.addEventListener('keydown', function onGalleryOverlayCloseEnterPress(evt) {
  if (!window.util.isEnterKey()) {
    return;
  }

  closeGalleryOverlay();
});

var uploadSelectImageForm = document.querySelector('#upload-select-image');
var uploadOverlay = uploadSelectImageForm.querySelector('.upload-overlay');
var uploadFile = uploadSelectImageForm.querySelector('#upload-file');
var uploadImage = uploadSelectImageForm.querySelector('.upload-image');
var uploadFormCancel = uploadSelectImageForm.querySelector('#upload-cancel');
var uploadFormHashtags = uploadSelectImageForm.querySelector('.upload-form-hashtags');
var uploadFormDescription = uploadSelectImageForm.querySelector('.upload-form-description');
var uploadEffectControls = uploadSelectImageForm.querySelector('.upload-effect-controls');
var uploadResizeControls = uploadSelectImageForm.querySelector('.upload-resize-controls');
var uploadResizeControlsValue = uploadResizeControls.querySelector('.upload-resize-controls-value');
var uploadImagePreview = uploadSelectImageForm.querySelector('.upload-form-preview');
var effectImagePreview = uploadImagePreview.querySelector('.effect-image-preview');

uploadSelectImageForm.addEventListener('submit', function onUploadSelectImageFormSubmit(evt) {
  if (!document.activeElement.classList.contains('upload-form-submit')) {
    evt.preventDefault();
    return;
  }

  var isValidForm = validateUploadForm();

  if (!isValidForm) {
    evt.preventDefault();
  }
});

uploadFormDescription.addEventListener('invalid', function (evt) {
  uploadFormDescription.style.border = '1px solid #f00';
});

uploadFormDescription.addEventListener('valid', function (evt) {
  uploadFormDescription.style.border = '';
});

function resetUploadForm() {
  uploadFile.value = '';
  uploadResizeControlsValue.value = '55%';
  effectImagePreview.className = 'effect-image-preview';
  effectImagePreview.style.transform = '';
  uploadEffectControls.querySelector('[name=effect]').checked = true;
  uploadFormHashtags.value = '';
  uploadFormDescription.value = '';
}

function validateUploadForm() {
  var isValidHashtags = validataFormHashtags();

  if (!isValidHashtags) {
    uploadFormHashtags.style.border = '1px solid #f00';
  } else {
    uploadFormHashtags.style.border = '';
  }

  return isValidHashtags;
}

function validataFormHashtags() {
  var hashtags = uploadFormHashtags.value.split(' ').sort();
  var noMoreThanFiveHashtags = hashtags.length <= 5;

  var hasDuplicate = (hashtags.length === 1) ? false : hashtags.some(function (item, index, array) {
    if (!array[index + 1]) {
      return false;
    }

    return item.toLowerCase() === array[index + 1].toLowerCase();
  });

  var everyHashtagPasses = hashtags.every(function (item) {
    // Each hashtags starts with a '#',
    // consits of one word,
    // has >= 20 letters
    return /^#[a-zA-Z]{1,20}$/.test(item);
  });

  return noMoreThanFiveHashtags && !hasDuplicate && everyHashtagPasses;
}

function onUploadOverlayEscPress(evt) {
  if (!window.util.isEscKey()) {
    return;
  }

  if (document.activeElement.classList.contains('upload-form-description')) {
    return;
  }

  closeUploadOverlay();
}

function openUploadOverlay() {
  uploadImage.classList.add('hidden');
  uploadOverlay.classList.remove('hidden');
}

function closeUploadOverlay() {
  document.removeEventListener('keydown', onUploadOverlayEscPress);

  resetUploadForm();

  uploadImage.classList.remove('hidden');
  uploadOverlay.classList.add('hidden');
}

uploadFile.addEventListener('change', function onUploadFileChange(evt) {
  document.addEventListener('keydown', onUploadOverlayEscPress);

  openUploadOverlay();
});

uploadFormCancel.addEventListener('click', function onUploadFormCancelClick(evt) {
  closeUploadOverlay();
});

uploadFormCancel.addEventListener('keydown', function onUploadFormCancelEnterPress(evt) {
  if (!window.util.isEnterKey()) {
    return;
  }

  closeUploadOverlay();
});

uploadEffectControls.addEventListener('change', function onUploadEffectControlsChange(evt) {
  if (evt.target.name !== 'effect') {
    return;
  }

  var effect = 'effect-' + evt.target.value;
  var radios = evt.currentTarget.querySelectorAll('[name=effect]');

  radios.forEach(function (item) {
    var effectName = 'effect-' + item.value;

    if (!effectImagePreview.classList.contains(effectName)) {
      return;
    }

    effectImagePreview.classList.remove(effectName);
  });

  effectImagePreview.classList.add(effect);
});

uploadResizeControls.addEventListener('click', function onUploadResizeControlsClick(evt) {
  var step = +uploadResizeControlsValue.getAttribute('step');
  var min = +uploadResizeControlsValue.getAttribute('min');
  var max = +uploadResizeControlsValue.getAttribute('max');
  var currentValue = +uploadResizeControlsValue.value.slice(0, -1); // cut off percents sign
  var newValue = null;

  // Decrease the value
  if (evt.target.classList.contains('upload-resize-controls-button-dec')) {
    newValue = currentValue - step;
    newValue = (newValue <= min) ? min : newValue;
  }

  // Increase the value
  if (evt.target.classList.contains('upload-resize-controls-button-inc')) {
    newValue = currentValue + step;
    newValue = (newValue >= max) ? max : newValue;
  }

  uploadResizeControlsValue.value = newValue + '%';
  effectImagePreview.style.transform = 'scale(' + (newValue / 100) + ')';
});
