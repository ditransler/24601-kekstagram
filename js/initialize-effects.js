'use strict';

(function () {
  window.initializeEffects = function (effectsContainer, effectElem, applyEffect) {
    effectsContainer.addEventListener('change', function onEffectControlsChange(evt) {
      if (evt.target.name !== 'effect') {
        return;
      }

      applyEffect(effectElem, evt.target.value, effectElem.dataset.effect);
    });
  };
})();
