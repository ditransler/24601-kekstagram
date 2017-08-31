'use strict';

(function () {
  var form = document.querySelector('#upload-select-image');
  var formOverlay = form.querySelector('.upload-overlay');
  var formPreview = form.querySelector('.upload-form-preview');
  var formCancel = form.querySelector('#upload-cancel');

  var uploadFile = form.querySelector('#upload-file');
  var uploadImage = form.querySelector('.upload-image');

  var hashtags = form.querySelector('.upload-form-hashtags');
  var description = form.querySelector('.upload-form-description');

  var effectControls = form.querySelector('.upload-effect-controls');

  var effectLevelLine = effectControls.querySelector('.upload-effect-level-line');
  var effectLevelPin = effectLevelLine.querySelector('.upload-effect-level-pin');
  var effectLevelVal = effectLevelLine.querySelector('.upload-effect-level-val');

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

  function resetForm() {
    uploadFile.value = '';
    resizeControlsValue.value = '55%';
    imagePreview.className = 'effect-image-preview';
    imagePreview.style.transform = '';
    effectControls.querySelector('[name=effect]').checked = true;
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
    uploadImage.classList.add('hidden');
    formOverlay.classList.remove('hidden');
  }

  function closeFormOverlay() {
    document.removeEventListener('keydown', onFormOverlayEscPress);

    resetForm();

    uploadImage.classList.remove('hidden');
    formOverlay.classList.add('hidden');
  }

  function getCoords(elem) {
    var box = elem.getBoundingClientRect();

    return {
      left: box.left + window.pageXOffset,
      top: box.top + window.pageYOffset
    };
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

  effectControls.addEventListener('change', function onEffectControlsChange(evt) {
    if (evt.target.name !== 'effect') {
      return;
    }

    var effect = 'effect-' + evt.target.value;
    var radios = evt.currentTarget.querySelectorAll('[name=effect]');

    radios.forEach(function (item) {
      var effectName = 'effect-' + item.value;

      if (!imagePreview.classList.contains(effectName)) {
        return;
      }

      imagePreview.classList.remove(effectName);
    });

    imagePreview.classList.add(effect);
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

  effectLevelPin.addEventListener('mousedown', function onEffectLevelPinMouseDown(evt) {
    evt.preventDefault();

    var pinCoords = getCoords(effectLevelPin);
    var lineCoords = getCoords(effectLevelLine);
    var shiftX = evt.pageX - pinCoords.left;

    function onEffectLevelPinMouseMove(moveEvt) {
      moveEvt.preventDefault();

      var newLeft = moveEvt.pageX - shiftX - lineCoords.left;

      if (newLeft < 0) {
        newLeft = 0;
      }

      var rightEdge = effectLevelLine.offsetWidth;

      if (newLeft > rightEdge) {
        newLeft = rightEdge;
      }

      effectLevelPin.style.left = newLeft + 'px';
      effectLevelVal.style.width = newLeft + 'px';
    }

    function onEffectLevelPinMouseUp(upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onEffectLevelPinMouseMove);
      document.removeEventListener('mouseup', onEffectLevelPinMouseUp);
    }

    document.addEventListener('mousemove', onEffectLevelPinMouseMove);
    document.addEventListener('mouseup', onEffectLevelPinMouseUp);

    return false; // disable selection start (cursor change)
  });

  effectLevelPin.addEventListener('dragstart', function (evt) {
    evt.preventDefault();
  });
})();
