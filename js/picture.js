'use strict';

(function () {
  var Picture = function (data) {
    this.id = this.generateId();
    this.url = data.url;
    this.likes = data.likes;
    this.comments = data.comments;
  };

  Picture.counter = 0;

  Picture.prototype.generateId = function () {
    return 'photo-' + (Picture.counter < 10 ? '0' + Picture.counter++ : Picture.counter++);
  };

  window.Picture = Picture;
})();
