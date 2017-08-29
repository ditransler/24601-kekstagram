'use strict';

(function () {
  var COMMENTS = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ];

  function generatePictureURL(index) {
    return 'photos/' + index + '.jpg';
  }

  function generateRandomComment(comments) {
    var isTwoLined = Math.floor(Math.random() * 2);
    var max = comments.length - 1;
    var firstLineIndex = window.util.getRandomInteger(0, max);
    var secondLineIndex = null;

    if (!isTwoLined) {
      return [comments[firstLineIndex]];
    }

    /**
     * When combining two lines of a comment
     * we don't want to pick the same line twice
     ***/
    secondLineIndex = window.util.getExceptRandomInteger(0, max, firstLineIndex);

    return [comments[firstLineIndex], comments[secondLineIndex]];
  }

  function generatePictures(quantity) {
    var pictures = [];

    quantity = quantity || 25;

    for (var i = 0; i < quantity; i++) {
      pictures.push({
        id: 'picture-' + ((i <= 9) ? '0' + i : i),
        url: generatePictureURL(i + 1, quantity),
        likes: window.util.getRandomInteger(15, 200),
        comments: generateRandomComment(COMMENTS)
      });
    }

    return pictures;
  }

  window.data = {
    generatePictures: generatePictures
  };
})();
