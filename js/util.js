'use strict';

(function () {
  var KEYCODES = {
    Enter: 13,
    Esc: 27
  };

  window.util = {
    isEscKey: function (evt) {
      return evt.keyCode === KEYCODES.Esc;
    },
    isEnterKey: function (evt) {
      return evt.keyCode === KEYCODES.Enter;
    },
    getRandomInteger: function getRandomInteger(min, max) {
      return Math.floor(min + Math.random() * (max + 1 - min));
    },
    getExceptRandomInteger: function getExceptRandomInteger(min, max, except) {
      var int = window.util.getRandomInteger(min, max);

      return (int === except) ? getExceptRandomInteger(min, max) : int;
    },
    getNounEnding: function getNounEnding(number, one, two, five) {
      var n = Math.abs(number);

      n %= 100;

      if (n >= 5 && n <= 20) {
        return five;
      }

      n %= 10;

      if (n === 1) {
        return one;
      }

      if (n >= 2 && n <= 4) {
        return two;
      }

      return five;
    }
  };
})();
