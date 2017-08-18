'use strict';

var COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

function generatePhotoURL(index) {
  return 'photos/' + index + '.jpg';
}

function getRandomInteger(min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
}

function getExceptRandomInteger(min, max, except) {
  var int = getRandomInteger(min, max);

  return (int === except) ? getExceptRandomInteger(min, max) : int;
}

function generateRandomComment(comments) {
  var isTwoLined = Math.floor(Math.random() * 2);
  var max = comments.length - 1;
  var firstLineIndex = getRandomInteger(0, max);
  var secondLineIndex = null;

  if (!isTwoLined) {
    return comments[firstLineIndex];
  }

  /**
   * When combining two lines of a comment
   * we don't want to pick the same line twice
   ***/
  secondLineIndex = getExceptRandomInteger(0, max, firstLineIndex);

  return comments[firstLineIndex] + '\n' + comments[secondLineIndex];
}

function generateOtherPhotos(quantity) {
  var photos = [];

  quantity = quantity || 25;

  for (var i = 0; i < quantity; i++) {
    photos.push({
      url: generatePhotoURL(i + 1, quantity),
      likes: getRandomInteger(15, 200),
      comments: generateRandomComment(COMMENTS)
    });
  }

  return photos;
}

function renderPhoto(photo, template) {
  var photoElem = template.cloneNode(true);

  photoElem.querySelector('.picture')
    .querySelector('img').setAttribute('src', photo.url);

  photoElem.querySelector('.picture-likes').textContent = photo.likes;

  photoElem.querySelector('.picture-comments').textContent = photo.comments;

  return photoElem;
}


