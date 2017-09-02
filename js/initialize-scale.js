'use strict';

(function () {
  var form = document.querySelector('#upload-select-image');
  var resizeControls = form.querySelector('.upload-resize-controls');
  var resizeControlsValue = resizeControls.querySelector('.upload-resize-controls-value');

  window.initializeScale = function (scaleElement, adjustScale) {
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

      adjustScale(scaleElement, newValue);
    });
  };
})();
