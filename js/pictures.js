'use strict';

function generatePhotoURLs(from, to) {
  var urls = [];

  for(var i = from; i <= to; i++) {
    urls.push('photos/' + i + '.jpg');
  }

  return urls;
}
