import { getActiveRoute } from "../routes/url-parser";
import {
  generateAuthenticatedNavigationListTemplate,
  generateMainNavigationListTemplate,
  generateSubscribeButtonTemplate,
  generateUnauthenticatedNavigationListTemplate,
  generateUnsubscribeButtonTemplate,
} from "../template";
import { transitionHelper, isServiceWorkerAvailable } from "../utils";
import { getAccessToken, getLogout } from "../utils/profile";
import { routes } from "../routes/routes";
import { subscribe, isCurrentPushSubscriptionAvailable, unsubscribe } from '../utils/notification-helper';

export default class App {
  #content;
  #drawerButton;
  #drawerNavigation;
  currentUrl;

  constructor({ content, drawerNavigation, drawerButton }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#drawerNavigation = drawerNavigation;

    this.#init();
  }

  #init() {
    this.#setupDrawer();
    this.#setupBrandLink();
    this.#setupSkipLink();
  }

  #setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      this.#drawerNavigation.classList.toggle('open');
    });

    document.body.addEventListener('click', (event) => {
      const isTargetInsideDrawer = this.#drawerNavigation.contains(event.target);
      const isTargetInsideButton = this.#drawerButton.contains(event.target);

      if (!(isTargetInsideDrawer || isTargetInsideButton)) {
        this.#drawerNavigation.classList.remove('open');
      }

      this.#drawerNavigation.querySelectorAll('a').forEach((link) => {
        if (link.contains(event.target)) {
          this.#drawerNavigation.classList.remove('open');
        }
      });
    });
  }

  #setupBrandLink() {
    const brandLink = document.querySelector('.brand-name');
    if (brandLink) {
      brandLink.addEventListener('click', (event) => {
        event.preventDefault();
        const isLogin = !!getAccessToken();
        if (isLogin) {
          location.hash = '/home';
        } else {
          location.hash = '/';
        }
      });
    }
  }

  #setupSkipLink() {
    const skipLink = document.getElementById('skip-link');
    const mainContent = document.getElementById('main-content');

    if (skipLink && mainContent) {
      skipLink.addEventListener('click', (event) => {
        event.preventDefault();
        skipLink.blur();

        mainContent.focus();
        mainContent.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }

  #setupNavigationList() {
    const isLogin = !!getAccessToken();
    const navListMain = this.#drawerNavigation.children.namedItem('navlist-main');
    const navList = this.#drawerNavigation.children.namedItem('navlist');

    if (!isLogin) {
      navListMain.innerHTML = '';
      navList.innerHTML = generateUnauthenticatedNavigationListTemplate();
      return;
    }

    navListMain.innerHTML = generateMainNavigationListTemplate();
    navList.innerHTML = generateAuthenticatedNavigationListTemplate();

    const logoutButton = document.getElementById('logout-button');
    logoutButton.addEventListener('click', (event) => {
      event.preventDefault();

      if (confirm('Are you sure you want to logout?')) {
        getLogout();

        location.hash = '/';
      }
    });
  }

  async #setupPushNotification() {
    const pushNotificationTools = document.getElementById('push-notification-tools');
    const isSubscribed = await isCurrentPushSubscriptionAvailable();

    if (isSubscribed) {
      pushNotificationTools.innerHTML = generateUnsubscribeButtonTemplate();
      document.getElementById('unsubscribe-button').addEventListener('click', () => {
        unsubscribe().finally(() => {
          this.#setupPushNotification();
        });
      });

      return;
    }

    pushNotificationTools.innerHTML = generateSubscribeButtonTemplate();
    document.getElementById('subscribe-button').addEventListener('click', () => {
      subscribe().finally(() => {
        this.#setupPushNotification();
      });
    });
  }

  async renderPage() {
    const url = getActiveRoute(); // Mendapatkan URL aktif
    const route = routes[url]; // Mencari rute berdasarkan URL aktif

    // Cek jika route adalah fungsi sebelum memanggilnya
    if (typeof route !== "function") {
      console.error(`Route not found for URL: ${url}`);
      return; // Jika route tidak ditemukan atau bukan fungsi, hentikan eksekusi
    }

    const page = route(); // Panggil route yang valid (fungsi)

    const transition = transitionHelper({
      updateDOM: async () => {
        this.#content.innerHTML = await page.render(); // Render halaman
        page.afterRender(); // Panggil afterRender() dari halaman
      },
    });

    transition.ready.catch(console.error);
    transition.updateCallbackDone.then(() => {
      scrollTo({ top: 0, behavior: 'instant' });
      this.#setupNavigationList();
 
      if (isServiceWorkerAvailable()) {
        this.#setupPushNotification();
      }
    });
  }
}

