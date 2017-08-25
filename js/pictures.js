'use strict';

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

function getRandomInteger(min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
}

function getNounEnding(number, one, two, five) {
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
    return [comments[firstLineIndex]];
  }

  /**
   * When combining two lines of a comment
   * we don't want to pick the same line twice
   ***/
  secondLineIndex = getExceptRandomInteger(0, max, firstLineIndex);

  return [comments[firstLineIndex], comments[secondLineIndex]];
}

function generatePictures(quantity) {
  var pictures = [];

  quantity = quantity || 25;

  for (var i = 0; i < quantity; i++) {
    pictures.push({
      url: generatePictureURL(i + 1, quantity),
      likes: getRandomInteger(15, 200),
      comments: generateRandomComment(COMMENTS)
    });
  }

  return pictures;
}

function renderPhoto(picture, template) {
  var pictureElem = template.cloneNode(true);

  pictureElem.querySelector('.picture')
    .querySelector('img').setAttribute('src', picture.url);

  pictureElem.querySelector('.picture-likes').textContent = picture.likes;

  pictureElem.querySelector('.picture-comments').textContent = picture.comments.length;

  return pictureElem;
}

function addPhotoToPictures(pictures, target, template) {
  var fragment = document.createDocumentFragment();

  pictures.forEach(function (picture) {
    fragment.appendChild(renderPhoto(picture, template));
  });

  target.appendChild(fragment);
}

function addPictureToGalleryOverlay(item, target) {
  target.querySelector('.gallery-overlay-image').setAttribute('src', item.url);
  target.querySelector('.likes-count').textContent = item.likes;

  var commentsCount = target.querySelector('.comments-count');
  var commentsLength = item.comments.length;

  commentsCount.textContent = commentsLength;

  commentsCount.nextSibling.textContent = commentsCount.nextSibling.textContent
    .replace(/(комментари)[а-я]{1,3}/i, function (match, p1) {
      return p1 + getNounEnding(commentsLength, 'й', 'я', 'ев');
    });
}

var pictureTemplate = document.querySelector('#picture-template').content;
var pictures = document.querySelector('.pictures');

var generatedPictures = generatePictures();

addPhotoToPictures(generatedPictures, pictures, pictureTemplate);

var uploadOverlay = document.querySelector('.upload-overlay');
uploadOverlay.classList.add('hidden');

var galleryOverlay = document.querySelector('.gallery-overlay');
var galleryOverlayClose = galleryOverlay.querySelector('.gallery-overlay-close');
addPictureToGalleryOverlay(generatedPictures[0], galleryOverlay);

pictures.addEventListener('click', function onPictureClick(evt) {
  var picture = evt.target.closest('.picture');

  evt.preventDefault();

  if (!picture) {
    return;
  }

  var pictureUrl = picture.querySelector('img').getAttribute('src');
  var pictureComments = picture.querySelector('.picture-comments').textContent;
  var pictureLikes = picture.querySelector('.picture-likes').textContent;

  var galleryComments = galleryOverlay.querySelector('.comments-count');

  galleryOverlay.querySelector('.gallery-overlay-image').setAttribute('src', pictureUrl);

  galleryComments.textContent = pictureComments;
  galleryComments.nextSibling.textContent = galleryComments.nextSibling.textContent
    .replace(/(комментари)[а-я]{1,3}/i, function (match, p1) {
      return p1 + getNounEnding(+pictureComments, 'й', 'я', 'ев');
    });

  galleryOverlay.querySelector('.likes-count').textContent = pictureLikes;

  galleryOverlay.classList.remove('hidden');
});

galleryOverlayClose.addEventListener('click', function onGalleryOverlayClose(evt) {
  galleryOverlay.classList.add('hidden');
});
