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
  if (!window.util.isEscKey(evt)) {
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
  if (!window.util.isEnterKey(evt)) {
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
