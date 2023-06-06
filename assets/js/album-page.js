const ALBUM_ENDPOINT =
  "https://striveschool-api.herokuapp.com/api/deezer/album/";
("https://striveschool-api.herokuapp.com/api/deezer/album/");

// crea un canvas con l'immagine e ne ritorno il context 2d
const draw = function (img) {
  let canvas = document.createElement("canvas");
  let c = canvas.getContext("2d");
  c.width = canvas.width = img.clientWidth;
  c.height = canvas.height = img.clientHeight;
  c.clearRect(0, 0, c.width, c.height);
  c.drawImage(img, 0, 0, img.clientWidth, img.clientHeight);
  return c;
};

// scompone pixel per pixel e ritorna un oggetto con una mappa della loro frequenza nell'immagine
const getColors = function (c) {
  let col,
    colors = {};
  let pixels, r, g, b, a;
  r = g = b = a = 0;
  pixels = c.getImageData(0, 0, c.width, c.height);
  for (let i = 0, data = pixels.data; i < data.length; i += 4) {
    r = data[i];
    g = data[i + 1];
    b = data[i + 2];
    a = data[i + 3];
    if (a < 255 / 2) continue;
    col = rgbToHex(r, g, b);
    if (!colors[col]) colors[col] = 0;
    colors[col]++;
  }
  return colors;
};

// trova il colore più ricorrente data una mappa di frequenza dei colori
const findMostRecurrentColor = function (colorMap) {
  let highestValue = 0;
  let mostRecurrent = null;
  for (const hexColor in colorMap) {
    if (colorMap[hexColor] > highestValue) {
      mostRecurrent = hexColor;
      highestValue = colorMap[hexColor];
    }
  }
  return mostRecurrent;
};

// converte un valore in rgb a un valore esadecimale
const rgbToHex = function (r, g, b) {
  if (r > 255 || g > 255 || b > 255) {
    throw "Invalid color component";
  } else {
    return ((r << 16) | (g << 8) | b).toString(16);
  }
};

// inserisce degli '0' se necessario davanti al colore in esadecimale per renderlo di 6 caratteri
const pad = function (hex) {
  return ("000000" + hex).slice(-6);
};

const generateImage = function (imageUrl) {
  let imageSrc = imageUrl;

  let reference = document.getElementById("main-container");

  reference.innerHTML = `
  <img id="album-cover" src="${imageSrc}" class="img-fluid w-100" onload="start()" crossorigin="anonymous"/> `;
};

const start = function () {
  // prendo il riferimento all'immagine del dom
  let imgReference = document.querySelector("#album-cover");

  // creo il context 2d dell'immagine selezionata
  let context = draw(imgReference);

  // creo la mappa dei colori più ricorrenti nell'immagine
  let allColors = getColors(context);

  // trovo colore più ricorrente in esadecimale
  let mostRecurrent = findMostRecurrentColor(allColors);

  // se necessario, aggiunge degli '0' per rendere il risultato un valido colore esadecimale
  let mostRecurrentHex = pad(mostRecurrent);

  // console.log del risultato
  console.log(mostRecurrentHex);

  let background = document.getElementById("background");
  background.style.backgroundImage = `linear-gradient(#${mostRecurrentHex},#212529)`;
  console.log(background.style.backgroundColor);
};

let addressBarContent = new URLSearchParams(window.location.search);
let albumId = addressBarContent.get("albumId");
let albumTitle = document.getElementById("album-title");
let albumCover = document.getElementById("album-cover");
let artistName = document.getElementById("artist-name");
let year = document.getElementById("year");
let tracks = document.getElementById("tracks");
let albumDuration = document.getElementById("album-duration");
let trackList = document.getElementById("track-list");

const startMusic = function (albums) {
  let songsFields = document.querySelectorAll(".play-me");
  let audio = false;
  let play;
  for (let i = 0; i < songsFields.length; i++) {
    audio = false;
    songsFields[i].addEventListener("click", () => {
      console.dir(songsFields[i]);
      let fileAudio = songsFields[i].dataset.effettoAudio;
      console.log(fileAudio);
      audio = new Audio(fileAudio);
      console.dir(audio);
      // audio.play();
      audio.buttonRefernce = document.getElementById("play-btn");

      audio.buttonRefernce.addEventListener("click", () => {
        if (play) {
          audio.pause();
          play = false;
        } else {
          audio.play();
          play = true;
        }
      });
    });
  }
};

const playButton = function () {
  let playButton = document.getElementById("play-btn");
  let onplay;

  playButton.addEventListener("click", () => {
    if (onplay) {
      playButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 512 512" fill="currentColor" class="mx-1">
          <!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
          <path d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c-7.6 4.2-12.3 12.3-12.3 20.9V344c0 8.7 4.7 16.7 12.3 20.9s16.8 4.1 24.3-.5l144-88c7.1-4.4 11.5-12.1 11.5-20.5s-4.4-16.1-11.5-20.5l-144-88c-7.4-4.5-16.7-4.7-24.3-.5z" />
        </svg> `;
      onplay = false;
    } else {
      playButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 512 512" fill="currentColor" class="mx-1">
          <!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
          <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM224 192V320c0 17.7-14.3 32-32 32s-32-14.3-32-32V192c0-17.7 14.3-32 32-32s32 14.3 32 32zm128 0V320c0 17.7-14.3 32-32 32s-32-14.3-32-32V192c0-17.7 14.3-32 32-32s32 14.3 32 32z"/>
        </svg>`;
      onplay = true;
    }
  });
};

const player = function (albums) {
  let songsFields = document.querySelectorAll(".play-me");
  let coverOnPlay = document.getElementById("cover-onplay");
  let titleOnPlay = document.getElementById("title-onplay");
  let artistOnPlay = document.getElementById("artist-onplay");

  for (let i = 0; i < songsFields.length; i++) {
    songsFields[i].addEventListener("click", () => {
      console.log(albums);
      console.dir(coverOnPlay);
      coverOnPlay.src = albums.cover;
      titleOnPlay.innerText = albums.tracks.data[i].title;
      console.log(albums.tracks.data[i].title);
      artistOnPlay.innerText = albums.artist.name;
    });
  }
};

const convertTime = (seconds) => {
  let minutes = Math.floor(seconds / 60);
  let remainingSeconds = seconds % 60;
  let formattedSeconds =
    remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;
  return `${minutes} mins ${formattedSeconds} sec`;
};

const trackTime = (seconds) => {
  let minutes = Math.floor(seconds / 60);
  let remainingSeconds = seconds % 60;
  let formattedSeconds =
    remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;
  return `${minutes} : ${formattedSeconds}`;
};

fetch(ALBUM_ENDPOINT + albumId)
  .then((res) => {
    if (res.ok) {
      return res.json();
    } else {
      throw new Error("ERROR FETCHING ALBUM");
    }
  })
  .then((singleAlbum) => {
    console.log("sono qui", singleAlbum);
    albumTitle.innerHTML = singleAlbum.title;
    // albumCover.src = `${singleAlbum.cover_medium}`;
    // albumCover.id = "img";
    artistName.innerHTML = `<a id="pop-title" href="./artist-page.html?artistId=${singleAlbum.artist.id}">${singleAlbum.artist.name}</a>`;
    year.innerHTML = singleAlbum.release_date;
    tracks.innerHTML = singleAlbum.nb_tracks;
    albumDuration.innerHTML = convertTime(singleAlbum.duration);

    cont = 1;

    singleAlbum.tracks.data.forEach((track) => {
      console.log(track);
      let item = document.createElement("div");
      item.classList.add(
        "row",
        "align-items-center",
        "px-4",
        "mt-3",
        "single-track"
      );
      item.innerHTML = `
    <div class="col-1">
        <p id="track-n" class="text-secondary my-0">${cont}</p>
    </div>
    <div class="col-6">
        <div data-effetto-audio="${
          track.preview
        }" class="text-light my-0 d-block play-me">
            <p class="mb-0" id="album-page-title">${track.title}</p>
        </div>
        <a href="./artist-page.html?artistId=${
          track.artist.id
        }" id="pop-title" class="text-secondary my-0 d-block">${
        track.artist.name
      }</a>
    </div>
    <div class="col-3">
        <p class="text-secondary text-center my-0">${track.rank}</p>
    </div>
    <div class="col-2">
        <p class="text-secondary text-center my-0">${trackTime(
          track.duration
        )}</p>
    </div>
    `;
      trackList.appendChild(item);
      cont++;
    });
    return singleAlbum;
  })
  .then((album) => {
    console.log(album);
    startMusic(album);
    player(album);
    generateImage(album.cover_medium);
  })
  .catch((err) => {
    console.log(err);
  });

window.onload = () => {
  playButton();
};
