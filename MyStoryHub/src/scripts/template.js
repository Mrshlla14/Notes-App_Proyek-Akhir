import { showFormattedDate } from './utils';

export function generateLoaderTemplate() {
  return `
    <div class="loader"></div>
  `;
}

export function generateLoaderAbsoluteTemplate() {
  return `
    <div class="loader loader-absolute"></div>
  `;
}

export function generateMainNavigationListTemplate() {
  return `
    <li><a id="story-list-button" class="nav-link" href="#/home" aria-label="Stories List">
      <i class="fas fa-home"></i> Home
    </a></li>
    <li><a id="favorite-button" class="nav-link" href="#/favorite" aria-label="Favorite Stories">
      <i class="far fa-heart"></i> Favorite
    </a></li>
  `;
}

export function generateUnauthenticatedNavigationListTemplate() {
  return `
    <li id="push-notification-tools" class="push-notification-tools"></li>
    <li><a id="login-button" class="nav-link auth-link" href="#/login" aria-label="Login">
      <i class="fas fa-sign-in-alt"></i> Login
    </a></li>
    <li><a id="register-button" class="nav-link auth-link" href="#/register" aria-label="Register">
      <i class="fas fa-user-plus"></i> Register
    </a></li>
  `;
}

export function generateAuthenticatedNavigationListTemplate() {
  return `
    <li id="push-notification-tools" class="push-notification-tools"></li>
    <li><a id="new-story-button" class="btn new-story-button" href="#/add" aria-label="Share Story">
      <i class="fas fa-plus"></i> Share Story
    </a></li>
    <li><a id="logout-button" class="logout-button" href="#/" aria-label="Logout">
      <i class="fas fa-sign-out-alt"></i> Logout
    </a></li>
  `;
}

export function generateStoriesListEmptyTemplate() {
  return `
    <div id="stories-list-empty" class="stories-list__empty">
      <i class="fas fa-plus"></i>
      <h2>No stories available</h2>
      <a href="#/add" class="btn">Share Story</a>
    </div>
  `;
}

export function generateStoriesListErrorTemplate(message) {
  return `
    <div id="stories-list-error" class="stories-list__error">
      <i class="fas fa-exclamation-triangle error-icon"></i>
      <h2>Error Loading Stories</h2>
      <p>${message ? message : 'Please try using a different network or report this error.'}</p>
      <button onclick="location.reload()" class="btn btn-outline">Try Again</button>
    </div>
  `;
}

export function generateStoryDetailsErrorTemplate(message) {
  return `
    <div id="stories-details-error" class="stories-details__error">
      <i class="fas fa-exclamation-triangle error-icon"></i>
      <h2>Error loading story details</h2>
      <p>${message ? message : 'Please try using a different network or report this error.'}</p>
      <a href="#/home" class="btn btn-outline">Back to Home</a>
    </div>
  `;
}

export function generateStoryItemTemplate({id,name,description,photoUrl,createdAt,location,lat,lon,}) {
  const latitude = location?.lat !== undefined ? location.lat : lat !== undefined ? lat : 0;
  const longitude = location?.lon !== undefined ? location.lon : lon !== undefined ? lon : 0;

  const locationDisplay =
    latitude === 0 && longitude === 0 ? 'Lokasi tidak tersedia' : `${latitude}, ${longitude}`;

  return `
    <div tabindex="0" class="story-item" data-storyid="${id}">
      <div class="story-item__image-container">
        <img class="story-item__image" src="${photoUrl}" alt="Story by ${name}">
      </div>
      <div class="story-item__body">
        <div class="story-item__main">
          <h2 id="story-title" class="story-item__title">${name}</h2>
          <div class="story-item__more-info">
            <div class="story-item__createdat">
              <i class="fas fa-calendar-alt"></i> ${showFormattedDate(createdAt, 'en-US')}
            </div>
            <div class="story-item__location">
              <i class="fas fa-map-marker-alt"></i> ${locationDisplay}
            </div>
          </div>
        </div>
        <div id="story-description" class="story-item__description">
          ${description}
        </div>
        <a class="btn story-item__read-more" href="#/story-details/${id}" aria-label="Read more about ${name}'s story">
          View Details
        </a>
      </div>
    </div>
  `;
}

export function generateStoryDetailsImageTemplate(imageUrl = null, alt = "") {
  if (!imageUrl) {
    return `
      <img class="story-details__image" src="images/placeholder-image.jpg" alt="Placeholder Image">
    `;
  }

  return `
    <img class="story-details__image" src="${imageUrl}" alt="${alt}">
  `;
}

  export function generateStoryDetailsTemplate({name,description,photoUrl,location,createdAt,}) {
  const createdAtFormatted = showFormattedDate(createdAt, "en-US");
  const imageHtml = generateStoryDetailsImageTemplate(photoUrl, `Story by ${name}`);

  const lat = location && location.lat !== undefined ? location.lat : 0;
  const lon = location && location.lon !== undefined ? location.lon : 0;

  const locationDisplay = `${lat}, ${lon}`;

  return `
    <div class="story-details-header">
      <div class="container">
        <h1 class="story-details-title">${name}'s Story</h1>
        
        <div class="story-details__meta" role="contentinfo" aria-label="Story metadata">
          <div class="story-details__meta-item">
            <i class="fas fa-calendar-alt" aria-hidden="true"></i> 
            <span>${createdAtFormatted}</span>
          </div>
          <div class="story-details__meta-item">
            <i class="fas fa-map-marker-alt" aria-hidden="true"></i> 
            <span>${locationDisplay}</span>
          </div>
          <div class="story-details__meta-item">
            <i class="fas fa-user" aria-hidden="true"></i> 
            <span>${name}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="story-details-content">
        <div class="story-details__image-container">
          ${imageHtml}
        </div>
        
        <div class="story-details__content-body">
          <div class="story-details__description-container">
            <h2 class="story-details__section-title">The Story</h2>
            <div class="story-details__description">
              ${description}
            </div>
          </div>
          
          <div class="story-details__map-container">
            <h2 class="story-details__section-title">Location</h2>
            <div class="story-details__map-wrapper">
              <div id="map" class="story-details__map" aria-label="Map showing story location"></div>
              <div id="map-loading-container"></div>
            </div>
          </div>
        </div>
        
        <div class="story-details__actions">
          <div id="save-actions-container"></div>
          <div id="share-actions-container">
            <button id="story-details-share" class="btn btn-outline" aria-label="Share this story">
              <i class="fas fa-share-alt" aria-hidden="true"></i> Share
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function generateSubscribeButtonTemplate() {
  return `
    <button id="subscribe-button" class="btn subscribe-button">
      On Notification <i class="fas fa-bell"></i>
    </button>
  `;
}

export function generateUnsubscribeButtonTemplate() {
  return `
    <button id="unsubscribe-button" class="btn unsubscribe-button">
      Off Notification <i class="fas fa-bell-slash"></i>
    </button>
  `;
}

export function generateSaveStoryButtonTemplate() {
  return `
    <button id="story-details-save" class="btn btn-outline" aria-label="Add to favorites">
      <i class="far fa-heart"></i> Favorite
    </button>
  `;
}

export function generateRemoveStoryButtonTemplate() {
  return `
    <button id="story-details-remove" class="btn btn-outline" aria-label="Remove from favorites">
      <i class="fas fa-heart"></i> Remove Favorite
    </button>
  `;
}