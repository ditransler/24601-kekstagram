'use strict';

(function () {
  var URLs = {
    load: 'https://1510.dump.academy/kekstagram/data',
    save: 'https://1510.dump.academy/kekstagram'
  };

  function makeRequest(options) {
    options = options || {};

    var xhr = new XMLHttpRequest();

    if (!xhr) {
      return false;
    }

    xhr.onreadystatechange = function () {
      try {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            options.onSuccess(xhr.responseText);
          } else {
            throw new Error('В процессе выполнения запроса произошла ошибка. Статус: ' + xhr.status);
          }
        }
      } catch (err) {
        options.onError(err);
      }
    };

    xhr.open(options.method, options.url);

    if (options.method === 'POST' && typeof options.data !== 'undefined') {
      xhr.send(options.data);
      return true;
    }

    xhr.send();

    return true;
  }

  window.backend = {
    load: function (onLoad, onError) {
      makeRequest({
        method: 'GET',
        url: URLs.load,
        onSuccess: onLoad,
        onError: onError
      });
    },
    save: function (data, onLoad, onError) {
      makeRequest({
        method: 'POST',
        url: URLs.save,
        data: data,
        onSuccess: onLoad,
        onError: onError
      });
    }
  };
})();
