import {
  generateLoaderAbsoluteTemplate,
  generateStoryItemTemplate,
  generateStoriesListEmptyTemplate,
  generateStoriesListErrorTemplate,
} from '../../template';
import HomePresenter from './home-presenter';
import Map from '../../utils/map';
import * as StoryAPI from '../../data/api';

export default class HomePage {
  #presenter = null;
  #map = null;


    async render() {
    const greeting = this.#getGreeting();

    return `
      <section class="home-welcome-section">
        <div class="container">
          <div class="home-welcome-content">
            <h1 class="home-greeting"><center>${greeting}</h1></center>
          </div>
        </div>
      </section>
      
      <section class="container stories-section" id="stories-section">
        <div class="stories-list__container">
          <div id="stories-list"></div>
          <div id="stories-list-loading-container"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new HomePresenter({
      view: this,
      model: StoryAPI,
    });

    await this.#presenter.initialGalleryAndMap();

    const visibleSkipButton = document.getElementById("visible-skip-button");
    if (visibleSkipButton) {
      visibleSkipButton.addEventListener("click", () => {
        const storiesSection = document.getElementById("stories-section");
        if (storiesSection) {
          storiesSection.scrollIntoView({ behavior: "smooth" });
          storiesSection.focus();
        }
      });
    }
  }

  #getGreeting() {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) {
      return "Haii Good Morning!";
    } else if (hour >= 12 && hour < 18) {
      return "Haii Good Afternoon!";
    } else {
      return "Haii Good Evening!";
    }
  }

  populateStoriesList(message, stories) {
    if (stories.length <= 0) {
      this.populateStoriesListEmpty();
      return;
    }

    const html = stories.reduce((accumulator, story) => {
      if (
        !story.location &&
        (story.lat !== undefined || story.lon !== undefined)
      ) {
        story.location = {
          lat: story.lat,
          lon: story.lon,
        };
      } else if (!story.location) {
        story.location = { lat: 0, lon: 0 };
      }

      return accumulator.concat(
        generateStoryItemTemplate({
          ...story,
          name: story.name,
        })
      );
    }, "");

    document.getElementById("stories-list").innerHTML = `
      <div class="stories-list">${html}</div>
    `;
  }

  populateStoriesListEmpty() {
    document.getElementById("stories-list").innerHTML =
      generateStoriesListEmptyTemplate();
  }

  populateStoriesListError(message) {
    document.getElementById("stories-list").innerHTML =
      generateStoriesListErrorTemplate(message);
  }

  async initialMap() {
    this.#map = await Map.build("#map", {
      zoom: 10,
      locate: true,
    });
  }

  showMapLoading() {
    document.getElementById("map-loading-container").innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideMapLoading() {
    document.getElementById("map-loading-container").innerHTML = "";
  }

  showLoading() {
    document.getElementById("stories-list-loading-container").innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideLoading() {
    document.getElementById("stories-list-loading-container").innerHTML = "";
  }
}
