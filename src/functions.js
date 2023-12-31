// import { musicData } from "./data.js";
import { USER_INTERFACE_ID } from "./constants.js";
import { getArtistData } from "../src/api/getArtistData.js";
import { createArtistInfoElement } from "../src/views/artistInfoView.js";
import { createErrorElement } from "./views/errorView.js";
import { FETCH_ERROR_MESSAGE } from "./constants.js";

// For mainPage - initMusicPlayer
export const createMusicPlayerContainer = () => {
  const userInterface = document.getElementById(USER_INTERFACE_ID);
  userInterface.innerHTML = "";
  const musicPlayerContainer = document.createElement("div");
  musicPlayerContainer.classList.add("music-player-container");
  musicPlayerContainer.id = "musicPlayerContainer";
  userInterface.appendChild(musicPlayerContainer);

  return musicPlayerContainer;
};

// For the Get Artist Info Button
export async function getArtistInfo(id) {
  try {
    const newArtistData = await getArtistData(id);
    return newArtistData;
  } catch (error) {
    throw error;
  }
}

export function filterArtistInfo(infoObject) {
  // Name
  const name = infoObject.name;

  // Image
  const imgUrl = infoObject["images"]["0"]["url"];

  // Popularity
  const popularity = infoObject.popularity;
  let popularityDescription;
  if (popularity >= 50) {
    popularityDescription = "Very Popular Artist";
  } else if (popularity >= 25) {
    popularityDescription = "Artist on the Rise";
  } else {
    popularityDescription = "Emerging Artist";
  }

  // Spotify
  const spotifyUrl = infoObject.external_urls.spotify;

  // Followers
  const followers = infoObject.followers.total;
  console.log(followers);
  console.log(infoObject);

  // Genres
  let genres = infoObject.genres.join(", ");
  if (infoObject.genres.length === 0) {
    const defaultGenre = "lofi";
    genres = defaultGenre;
  }

  //filteredObject
  const filteredObject = {
    name: `${name}`,
    imgUrl: `${imgUrl}`,
    spotifyUrl: `${spotifyUrl}`,
    popularity: `${popularityDescription}`,
    followers: `${followers}`,
    genres: `${genres}`,
  };

  return filteredObject;
}

export function enableArtistInfoButton(currentPlaylist) {
  const currentArtistId = currentPlaylist.artistId;
  const artistInfoButton = document.getElementById("artist-info-button");

  artistInfoButton.addEventListener("click", async () => {
    try {
      const newArtistInfo = await getArtistInfo(currentArtistId);

      const newArtistInfoObject = filterArtistInfo(newArtistInfo);
      console.log(newArtistInfoObject.name);
      const newArtistInfoElement = createArtistInfoElement(newArtistInfoObject);

      const userInterface = document.getElementById(USER_INTERFACE_ID);
      userInterface.appendChild(newArtistInfoElement);

      // Show Popup and Close Popup
      const popup = document.getElementById("popup");
      popup.style.display = "block";

      const closePopupButton = document.getElementById("closePopup");
      closePopupButton.addEventListener("click", () => {
        popup.style.display = "none";
        popup.remove();
      });
    } catch (error) {
      error.message = FETCH_ERROR_MESSAGE;
      console.log(error.message);
      const errorElement = createErrorElement(error.message);
      console.log(errorElement);
      showErrorMessage(errorElement);

      throw error;
    }
  });
}

// For Error handling - Showing user-friendly error message
export function showErrorMessage(errorElement) {
  const userInterface = document.getElementById(USER_INTERFACE_ID);
  userInterface.appendChild(errorElement);

  // Show Popup and Close Popup
  const popup = document.getElementById("popup");
  popup.style.display = "block";

  const closePopupButton = document.getElementById("closePopup");
  closePopupButton.addEventListener("click", () => {
    popup.style.display = "none";
    popup.remove();
  });
}
