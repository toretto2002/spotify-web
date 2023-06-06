const ARTIST_ENDPOINT =
  "https://striveschool-api.herokuapp.com/api/deezer/artist/";

let addressBarContent = new URLSearchParams(window.location.search);
let artistId = addressBarContent.get("artistId");
let artistName = document.getElementById("artist-name");
let fans = document.getElementById("fans");
let heroImg = document.getElementById("hero-img");
let trackContainer = document.getElementById("track-container");
let favImg = document.getElementById("favorite-img");
let favBand = document.getElementById("favorite-band");

const startMusic = function (albums) {
  let songsFields = document.querySelectorAll(".play-me");
  let audio;
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
      console.log(albums.data[i]);
      console.dir(coverOnPlay);
      coverOnPlay.src = albums.data[i].album.cover;
      titleOnPlay.innerText = albums.data[i].album.title;
      artistOnPlay.innerText = albums.data[i].artist.name;
    });
  }
};

function convertTime(seconds) {
  let minutes = Math.floor(seconds / 60);
  let remainingSeconds = seconds % 60;
  let formattedSeconds =
    remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;
  return `${minutes} : ${formattedSeconds}`;
}

fetch(ARTIST_ENDPOINT + artistId)
  .then((res) => {
    if (res.ok) {
      return res.json();
    } else {
      throw new Error("error fetching artist");
    }
  })
  .then((singleArtist) => {
    console.log(singleArtist);
    artistName.innerHTML = singleArtist.name;
    fans.innerHTML = singleArtist.nb_fan;
    heroImg.style.backgroundImage = `url("${singleArtist.picture_xl}")`;
    favBand.innerHTML = singleArtist.name;
    favImg.src = `${singleArtist.picture_small}`;
  })
  .catch((err) => {
    console.log(err);
  });

const POPULARS = `https://striveschool-api.herokuapp.com/api/deezer/artist/${artistId}/top?limit=50`;

fetch(POPULARS)
  .then((res) => {
    if (res.ok) {
      return res.json();
    } else {
      throw new Error("error fetching artist");
    }
  })
  .then((popTracks) => {
    console.log(popTracks);

    let cont = 1;
    popTracks.data.forEach((track) => {
      let item = document.createElement("div");
      console.log(track);

      item.classList.add(
        "d-flex",
        "my-2",
        "ps-3",
        "ps-lg-5",
        "flex-wrap",
        "align-items-center",
        "single-track"
      );
      item.innerHTML = `
                <div class="col-1 text-secondary">${cont}</div>
                <div class="col-10 d-flex align-items-center">
                  <div>
                    <img class="pe-3"
                      style="height: 50px"
                      src="${track.album.cover_small}"
                      alt="album cover"
                    />
                  </div>
                  <div class="d-flex flex-wrap flex-grow-1">
                    <div class="col-12 col-lg-10 play-me" data-effetto-audio="${
                      track.preview
                    }"> <h6 id="pop-title">${track.title_short} ${
        track.title_version
      }</h6>
                    </div>
                    <div class="col-12 col-lg-2 text-secondary">${track.rank}
                    </div>
                  </div>                    
                  </div>
                </div>
                <div class="d-none d-lg-block col-1 text-secondary">${convertTime(
                  track.duration
                )}</div>
                `;
      trackContainer.appendChild(item);
      cont++;
    });
    return popTracks;
  })
  .then((tracks) => {
    console.log(tracks);
    player(tracks);
    startMusic(tracks);
  })
  .catch((err) => {
    console.log(err);
  });

window.onload = () => {
  playButton();
};
