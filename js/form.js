'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var form = document.querySelector('#upload-select-image');
  var formOverlay = form.querySelector('.upload-overlay');
  var formPreview = form.querySelector('.upload-form-preview');
  var formCancel = form.querySelector('#upload-cancel');

  var uploadFile = form.querySelector('#upload-file');
  var uploadImage = form.querySelector('.upload-image');

  var hashtags = form.querySelector('.upload-form-hashtags');
  var description = form.querySelector('.upload-form-description');

  var effectControls = form.querySelector('.upload-effect-controls');
  var effectLevel = effectControls.querySelector('.upload-effect-level');
  var effectPreview = effectControls.querySelectorAll('.upload-effect-preview');

  var resizeControls = form.querySelector('.upload-resize-controls');
  var resizeControlsValue = resizeControls.querySelector('.upload-resize-controls-value');

  var imagePreview = formPreview.querySelector('.effect-image-preview');

  function resetForm() {
    uploadFile.value = '';
    resizeControlsValue.value = '100%';
    imagePreview.style.transform = '';
    effectControls.querySelector('[name=effect]').checked = true;
    effectLevel.style.display = 'none';
    hashtags.value = '';
    description.value = '';
  }

  function validataHashtags() {
    var hashtagsArr = hashtags.value.split(' ').sort();
    var noMoreThanFiveHashtags = hashtagsArr.length <= 5;
    var isValid = false;

    var hasDuplicate = (hashtagsArr.length === 1) ? false : hashtagsArr.some(function (item, index, array) {
      if (!array[index + 1]) {
        return false;
      }

      return item.toLowerCase() === array[index + 1].toLowerCase();
    });

    var everyHashtagPasses = hashtagsArr.every(function (item) {
      // Each hashtags starts with a '#',
      // consits of one word,
      // has >= 20 letters
      return /^#[a-zA-Z]{1,20}$/.test(item);
    });

    isValid = noMoreThanFiveHashtags && !hasDuplicate && everyHashtagPasses;

    if (!isValid) {
      hashtags.style.border = '1px solid #f00';
      return false;
    }

    hashtags.style.border = '';
    return true;
  }

  function onFormOverlayEscPress(evt) {
    if (!window.util.isEscKey(evt)) {
      return;
    }

    if (document.activeElement.classList.contains('upload-form-description')) {
      return;
    }

    closeFormOverlay();
  }

  function openFormOverlay() {
    uploadImage.classList.add('hidden');
    formOverlay.classList.remove('hidden');
    document.body.classList.add('is-overlay-opened');
  }

  function closeFormOverlay() {
    document.removeEventListener('keydown', onFormOverlayEscPress);

    resetForm();

    uploadImage.classList.remove('hidden');
    formOverlay.classList.add('hidden');
    document.body.classList.remove('is-overlay-opened');
  }

  function adjustScale(element, scale) {
    element.style.transform = 'scale(' + (scale / 100) + ')';
  }

  function applyEffect(element, newEffect, oldEffect) {
    element.classList.remove('effect-' + oldEffect);

    element.classList.add('effect-' + newEffect);
  }

  function onFormSaveLoad() {
    closeFormOverlay();
  }

  function onFormSaveError(err) {
    closeFormOverlay();

    window.message.showError(err);
  }

  function onPreloadFileSuccess(evt) {
    document.addEventListener('keydown', onFormOverlayEscPress);

    imagePreview.src = evt.target.result;
    effectPreview.forEach(function (item) {
      item.style.backgroundImage = 'url("' + evt.target.result + '")';
    });

    openFormOverlay();
  }

  function preloadFile(item, cb) {
    var itemName = item.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return itemName.endsWith(it);
    });

    if (!matches) {
      return;
    }

    var reader = new FileReader();

    reader.addEventListener('load', cb);

    reader.readAsDataURL(item);
  }

  form.addEventListener('submit', function onFormSubmit(evt) {
    evt.preventDefault();

    if (!document.activeElement.classList.contains('upload-form-submit')) {
      return;
    }

    if (hashtags.value !== '' && !validataHashtags()) {
      return;
    }

    var formData = new FormData(form);

    window.backend.save(formData, onFormSaveLoad, onFormSaveError);
  });

  description.addEventListener('invalid', function () {
    description.style.border = '1px solid #f00';
  });

  uploadFile.addEventListener('change', function onUploadFileChange(evt) {
    var file = evt.target.files[0];

    if (!file) {
      return;
    }

    preloadFile(file, onPreloadFileSuccess);
  });

  formCancel.addEventListener('click', function onFormCancelClick(evt) {
    closeFormOverlay();
  });

  formCancel.addEventListener('keydown', function onFormCancelEnterPress(evt) {
    if (!window.util.isEnterKey(evt)) {
      return;
    }

    closeFormOverlay();
  });

  window.initializeScale(imagePreview, adjustScale);

  window.initializeEffects(imagePreview, applyEffect);
})();
