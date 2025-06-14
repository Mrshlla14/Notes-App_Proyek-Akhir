// Import CSS
import App from '../scripts/pages/app';
import Camera from './utils/camera';
import '../styles/base.css';
import '../styles/buttons.css';
import '../styles/forms.css';
import '../styles/header.css';
import '../styles/footer.css';
import '../styles/home.css';
import '../styles/story-items.css';
import '../styles/story-details.css';
import '../styles/add-story.css';
import '../styles/maps.css';
import '../styles/profile.css';
import '../styles/favorite.css';
import '../styles/loader.css';
import '../styles/beranda.css';
import '../styles/responsive.css';
import '../styles/not-found.css'; 
import { registerServiceWorker } from './utils';

document.addEventListener("DOMContentLoaded", async () => {
  const app = new App({
    content: document.getElementById("main-content"),
    drawerButton: document.getElementById("drawer-button"),
    drawerNavigation: document.getElementById("navigation-drawer"),
  });
  await app.renderPage();

    await registerServiceWorker();

  window.addEventListener("hashchange", async () => {
    await app.renderPage();

    // Stop all active media
    Camera.stopAllStreams();
  });
});