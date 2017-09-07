'use strict';

(function () {
  var EFFECTS = {
    chrome: {
      filter: 'grayscale',
      max: 1
    },
    sepia: {
      filter: 'sepia',
      max: 1
    },
    marvin: {
      filter: 'invert',
      max: 100,
      units: '%'
    },
    phobos: {
      filter: 'blur',
      max: 3,
      units: 'px'
    },
    heat: {
      filter: 'brightness',
      max: 3
    }
  };

  var currentEffect = 'none';

  var form = document.querySelector('#upload-select-image');

  var imagePreview = form.querySelector('.effect-image-preview');

  var effectControls = form.querySelector('.upload-effect-controls');

  var effectLevel = effectControls.querySelector('.upload-effect-level');
  var effectLevelLine = effectControls.querySelector('.upload-effect-level-line');
  var effectLevelPin = effectLevelLine.querySelector('.upload-effect-level-pin');
  var effectLevelVal = effectLevelLine.querySelector('.upload-effect-level-val');

  function getCoords(elem) {
    var box = elem.getBoundingClientRect();

    return {
      left: box.left + window.pageXOffset,
      top: box.top + window.pageYOffset
    };
  }

  function updateEffectLevel(percents) {
    var effect = EFFECTS[currentEffect];
    var value = (typeof percents !== 'undefined') ? (effect.max * percents) / 100 : effect.max;

    value = effect.units ? value + effect.units : value;

    imagePreview.style.filter = effect.filter + '(' + value + ')';
  }

  function changeLevelDisplay() {
    if (currentEffect === 'none') {
      effectLevel.style.display = 'none';
      imagePreview.style.filter = '';
      return;
    }

    updateEffectLevel();
    effectLevelPin.style.left = '100%';
    effectLevelVal.style.width = '100%';
    effectLevel.style.display = 'block';
  }

  function applyEffect(element, newEffect, oldEffect) {
    element.classList.remove('effect-' + oldEffect);

    element.classList.add('effect-' + newEffect);

    element.dataset.effect = currentEffect = newEffect;

    changeLevelDisplay();
  }

  changeLevelDisplay();

  window.initializeEffects(effectControls, imagePreview, applyEffect);

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

      var percents = (newLeft * 100) / rightEdge;

      updateEffectLevel(percents);

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

  window.formEffects = {
    resetEffects: function () {
      effectControls.querySelector('[name=effect]').checked = true;
      effectLevel.style.display = 'none';
    }
  };
})();
