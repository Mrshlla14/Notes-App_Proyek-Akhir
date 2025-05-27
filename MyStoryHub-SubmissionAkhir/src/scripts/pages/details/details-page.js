import {
  generateDetailsErrorTemplate,
  generateDetailsTemplate,
  generateSaveStoryButtonTemplate,
  generateRemoveStoryButtonTemplate,
  generateLoaderAbsoluteTemplate,
} from "../../template";
import DetailsPresenter from "./details-presenter";
import { parseActivePathname } from "../../routes/url-parser";
import Map from "../../utils/map";
import * as StoryAPI from "../../data/api";
import IdbSource from '../../data/idb-source';

export default class DetailsPage {
  constructor() {
    this.presenter = null;
    this.map = null;
  }

  async render() {
    return `
      <section class="details-container">
        <div class="container">
          <a href="#/home" class="back-button" aria-label="Back to stories list">
            <i class="fas fa-arrow-left"></i> Back to Stories
          </a>
        </div>
        <div id="details" class="details"></div>
        <div id="details-loading-container" class="details-loading"></div>
      </section>
    `;
  }

  async afterRender() {
    const storyId = parseActivePathname().id;

    if (!storyId) {
      this.populateDetailsError("Story ID not found");
      return;
    }

    this.presenter = new DetailsPresenter(storyId, {
      view: this,
      apiModel: StoryAPI,
    });

    this.presenter.showDetails();
  }

  async populateDetailsAndInitialMap(message, story) {
    try {
      if (!story) {
        throw new Error("Story data is missing");
      }

      const location = story.location || { lat: 0, lon: 0, placeName: "Unknown location",};

      const lat = location.lat !== undefined ? location.lat : 0;
      const lon = location.lon !== undefined ? location.lon : 0;

      document.getElementById("details").innerHTML = generateDetailsTemplate({
        name: story.name || "Unknown",
        description: story.description || "No description available",
        photoUrl: story.photoUrl,
        location: {
          ...location,
          lat,
          lon,
        },
        createdAt: story.createdAt || new Date().toISOString(),
      });

      await this.initialMap();

      if (this.map) {
        const storyCoordinate = [lat, lon];

        if ((lat !== 0 || lon !== 0) && !isNaN(Number(lat)) && !isNaN(Number(lon))) {
          const markerOptions = { alt: `${story.name}'s story location` };
          const popupOptions = {
            content: `${story.name}'s story was shared from here`,
          };

          this.map.changeCamera(storyCoordinate, 15);
          this.map.addMarker(storyCoordinate, markerOptions, popupOptions);
        } else {
          console.warn("Story has invalid coordinates:", { lat, lon }, "using default map view");
        }
      } else {
        console.error("Map not initialized");
      }

      // Call showSaveButton function to add save button for offline storage
      await this.renderSaveOfflineButton(story);

      this.presenter.showSaveButton();
      this.addShareEventListener();
    } catch (error) {
      console.error("Error populating details:", error);
      this.populateDetailsError("Error displaying story details. Please try again.");
    }
  }

  async renderSaveOfflineButton(story) {
    const saveOfflineBtn = document.createElement('button');
    saveOfflineBtn.id = 'save-offline-button';
    saveOfflineBtn.className = 'btn btn-outline';
    saveOfflineBtn.innerHTML = '<i class="fas fa-download"></i> Simpan Offline';

    const storyId = this.presenter.getStoryId();
    const savedStory = await IdbSource.getStoryById(storyId);

    if (savedStory) {
      saveOfflineBtn.disabled = true;
      saveOfflineBtn.innerHTML = '<i class="fas fa-check"></i> Tersimpan Offline';
    }

    saveOfflineBtn.addEventListener('click', async () => {
      try {
        await IdbSource.saveStory({
          id: storyId,
          name: story.name,
          description: story.description,
          photoUrl: story.photoUrl,
          createdAt: story.createdAt,
          location: story.location,
        });

        saveOfflineBtn.disabled = true;
        saveOfflineBtn.innerHTML = '<i class="fas fa-check"></i> Tersimpan Offline';

        alert('Cerita berhasil disimpan untuk dibaca offline!');
      } catch (error) {
        console.error('Gagal menyimpan cerita offline:', error);
        alert('Gagal menyimpan cerita. Silakan coba lagi.');
      }
    });

    const actionsContainer = document.querySelector('.details__actions');
    actionsContainer.appendChild(saveOfflineBtn);
  }

  populateDetailsError(message) {
    document.getElementById("details").innerHTML = generateDetailsErrorTemplate(message);
  }

  async initialMap() {
    try {
      const mapElement = document.getElementById("map");
      console.log("Map element:", mapElement);
      if (!mapElement) {
        console.error("Map element not found");
        return;
      }
      await new Promise(requestAnimationFrame);

      this.map = await Map.build("#map", {
        zoom: 15,
      });

      if (!this.map) {
        console.error("Failed to create map instance");
        mapElement.innerHTML = `
          <div class="map-error">
            <i class="fas fa-exclamation-triangle"></i>
            <p>Unable to Load Map. Check your Internet Connection.</p>
          </div>
        `;
      } else {
        console.log("Map initialized successfully");
      }
    } catch (error) {
      console.error("Error initializing map:", error);
      const mapElement = document.getElementById("map");
      if (mapElement) {
        mapElement.innerHTML = `
          <div class="map-error">
            <i class="fas fa-exclamation-triangle"></i>
            <p>Unable to Load Map. Check your Internet Connection.</p>
          </div>
        `;
      }
    }
  }

renderSaveButton() {
    const saveContainer = document.getElementById("save-actions-container");
    if (saveContainer) {
      saveContainer.innerHTML = generateSaveStoryButtonTemplate();

      document.getElementById("details-save") ?.addEventListener("click", async () => {
          const storyId = parseActivePathname().id;
          const response = await this.presenter.toggleFavorite({
            id: storyId,
            name: document.querySelector(".details-title").textContent,
            description: document.querySelector(".details__description")
              .textContent,
            photoUrl: document.querySelector(".details__image").src,
            createdAt: new Date().toISOString(),
          });

          if (response) {
            alert("Story Favorited Successfully!");
          }
        });
    }
  }

  renderRemoveButton() {
    const saveContainer = document.getElementById("save-actions-container");
    if (saveContainer) {
      saveContainer.innerHTML = generateRemoveStoryButtonTemplate();

      document.getElementById("details-remove") ?.addEventListener("click", async () => {
          const response = await this.presenter.toggleFavorite();
          if (!response) {
            alert("Story Removed from Favorites!");
          }
        });
    }
  }

  addShareEventListener() {
    const shareButton = document.getElementById("details-share");
    if (shareButton) {
      shareButton.addEventListener("click", () => {
        if (navigator.share) {
          navigator
            .share({
              title: "Check out this story on StoryShare",
              text: "I found an interesting story on StoryShare!",
              url: window.location.href,
            })
            .catch((error) => console.log("Error sharing:", error));
        } else {
          alert("Sharing is not supported in your browser. Copy the URL to share manually.");
        }
      });
    }
  }

  showDetailsLoading() {
    const loadingContainer = document.getElementById("details-loading-container");
    if (loadingContainer) {
      loadingContainer.innerHTML = generateLoaderAbsoluteTemplate();
    }
  }

  hideDetailsLoading() {
    const loadingContainer = document.getElementById("details-loading-container");
    if (loadingContainer) {
      loadingContainer.innerHTML = "";
    }
  }

  showMapLoading() {
    const mapLoadingContainer = document.getElementById("map-loading-container");
    if (mapLoadingContainer) {
      mapLoadingContainer.innerHTML = generateLoaderAbsoluteTemplate();
    }
  }

  hideMapLoading() {
    const mapLoadingContainer = document.getElementById("map-loading-container");
    if (mapLoadingContainer) {
      mapLoadingContainer.innerHTML = "";
    }
  }
}
