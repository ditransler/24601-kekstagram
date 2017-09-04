'use strict';

(function () {
  var form = document.querySelector('#upload-select-image');
  var uploadMessage = form.querySelector('.upload-message');
  var uploadMessageContainer = uploadMessage.querySelector('.upload-message-container');

  var br = document.createElement('br');

  var reloadLink = document.createElement('a');

  reloadLink.setAttribute('href', '#');

  reloadLink.onclick = function (evt) {
    evt.preventDefault();
    window.location.reload();
  };

  reloadLink.textContent = 'Перезагрузить страницу';

  window.message = {
    showError: function (err) {
      uploadMessageContainer.textContent = err;
      uploadMessageContainer.appendChild(br);
      uploadMessageContainer.appendChild(reloadLink);
      uploadMessage.classList.add('upload-message-error');

      uploadMessage.classList.remove('hidden');
    }
  };
})();
