const renderSearchParameter = function (searched) {
  searched = searched.toLowerCase();
  searched = searched.trim();
  searched = searched.replace(/ /g, "_");
  return searched;
};

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
      console.log(albums[i]);
      console.dir(coverOnPlay);
      coverOnPlay.src = albums[i].album.cover;
      titleOnPlay.innerText = albums[i].album.title;
      artistOnPlay.innerText = albums[i].artist.name;
    });
  }
};

const searchAndLoad = function (searched) {
  fetch(
    `https://striveschool-api.herokuapp.com/api/deezer/search?q=${searched}`
  )
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error("couldn't load the search");
      }
    })
    .then((searchedItems) => {
      console.log(searchedItems);
      let searchContainer = document.getElementById("search-container");
      let underSearchContainer = document.getElementById(
        "under-search-container"
      );
      searchContainer.innerHTML = "";
      underSearchContainer.innerHTML = "";

      let newSearchUl = document.createElement("ul");
      newSearchUl.classList.add("list-unstyled");
      searchContainer.appendChild(newSearchUl);

      searchedItems.data.forEach((item) => {
        let newli = document.createElement("li");
        newli.classList.add("mb-2");

        newli.innerHTML = `
        <div class="d-flex">
            <div data-effetto-audio="${item.preview}" class="me-2 play-me">
                <img src="${item.album.cover}" style="width: 50px;"/>
            </div>
            <div class="d-flex flex-column">
                <a class="text-light fw-bold text-decoration-none" href="album-page.html?albumId=${item.album.id}">${item.album.title}</a>
                <a class="text-light text-decoration-none" href="artist-page.html?artistId=${item.artist.id}">${item.artist.name}</a>
            </div>
        </div>
        `;
        newSearchUl.appendChild(newli);
      });
      return searchedItems.data;
    })
    .then((albums) => {
      player(albums);
      startMusic(albums);
    })
    .catch((err) => {
      let searchContainer = document.getElementById("search-container");
      let underSearchContainer = document.getElementById(
        "under-search-container"
      );

      searchContainer.innerHTML = `
      <p>la tua ricerca non è andata a buon fine prova qualcos'altro</p>`;
      underSearchContainer.innerHTML = "";
      console.log(err);
    });
};

const formHandler = function () {
  let mainForm = document.getElementById("search-form");
  let searched = document.querySelector("#search-form input");

  mainForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let formattedSearch = renderSearchParameter(searched.value);
    searchAndLoad(formattedSearch);
  });
};

window.onload = () => {
  formHandler();
  playButton();
};
