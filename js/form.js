'use strict';

(function () {

  var initialFormValues = {};

  var form = document.querySelector('#upload-select-image');
  var formOverlay = form.querySelector('.upload-overlay');
  var formPreview = form.querySelector('.upload-form-preview');
  var formCancel = form.querySelector('#upload-cancel');

  var uploadFile = form.querySelector('#upload-file');
  var uploadImage = form.querySelector('.upload-image');

  var hashtags = form.querySelector('.upload-form-hashtags');
  var description = form.querySelector('.upload-form-description');

  var resizeControls = form.querySelector('.upload-resize-controls');
  var resizeControlsValue = resizeControls.querySelector('.upload-resize-controls-value');

  var imagePreview = formPreview.querySelector('.effect-image-preview');

  form.addEventListener('submit', function onFormSubmit(evt) {
    if (!document.activeElement.classList.contains('upload-form-submit')) {
      evt.preventDefault();
      return;
    }

    var isValidForm = validateForm();

    if (!isValidForm) {
      evt.preventDefault();
    }
  });

  function getInitalFormValues() {
    initialFormValues.resize = resizeControlsValue.value;
  }

  function resetForm() {
    uploadFile.value = '';
    resizeControlsValue.value = initialFormValues.resize;
    imagePreview.style.transform = '';
    window.formEffects.resetEffects();
    hashtags.value = '';
    description.value = '';
  }

  function validateForm() {
    return validataHashtags() & validateDescription();
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

  function validateDescription() {
    if (description.checkValidity()) {
      description.style.border = '';
      return true;
    }

    return false;
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
    getInitalFormValues();

    uploadImage.classList.add('hidden');
    formOverlay.classList.remove('hidden');
  }

  function closeFormOverlay() {
    document.removeEventListener('keydown', onFormOverlayEscPress);

    resetForm();

    uploadImage.classList.remove('hidden');
    formOverlay.classList.add('hidden');
  }

  description.addEventListener('invalid', function () {
    description.style.border = '1px solid #f00';
  });

  uploadFile.addEventListener('change', function onUploadFileChange(evt) {
    document.addEventListener('keydown', onFormOverlayEscPress);

    openFormOverlay();
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

  resizeControls.addEventListener('click', function onResizeControlsClick(evt) {
    var step = +resizeControlsValue.getAttribute('step');
    var min = +resizeControlsValue.getAttribute('min');
    var max = +resizeControlsValue.getAttribute('max');
    var currentValue = +resizeControlsValue.value.slice(0, -1); // cut off percents sign
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

    resizeControlsValue.value = newValue + '%';
    imagePreview.style.transform = 'scale(' + (newValue / 100) + ')';
  });

})();
