import { getActiveRoute } from "../routes/url-parser";
import {
  generateAuthenticatedNavigationListTemplate,
  generateMainNavigationListTemplate,
  generateUnauthenticatedNavigationListTemplate,
} from "../template";
import { transitionHelper } from "../utils";
import { getAccessToken, getLogout } from "../utils/profile";
import { routes } from "../routes/routes";

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
    this.#drawerButton.addEventListener("click", () => {
      this.#drawerNavigation.classList.toggle("open");
    });

    document.body.addEventListener("click", (event) => {
      const isTargetInsideDrawer = this.#drawerNavigation.contains(event.target);
      const isTargetInsideButton = this.#drawerButton.contains(event.target);

      if (!(isTargetInsideDrawer || isTargetInsideButton)) {
        this.#drawerNavigation.classList.remove("open");
      }

      this.#drawerNavigation.querySelectorAll("a").forEach((link) => {
        if (link.contains(event.target)) {
          this.#drawerNavigation.classList.remove("open");
        }
      });
    });
  }

  #setupBrandLink() {
    const brandLink = document.querySelector(".brand-name");
    if (brandLink) {
      brandLink.addEventListener("click", (event) => {
        event.preventDefault();
        const isLogin = !!getAccessToken();
        location.hash = isLogin ? "/home" : "/";
      });
    }
  }

  #setupSkipLink() {
    const skipLink = document.getElementById("skip-link");
    const mainContent = document.getElementById("main-content");

    if (skipLink && mainContent) {
      skipLink.addEventListener("click", (event) => {
        event.preventDefault();
        skipLink.blur();

        mainContent.focus();
        mainContent.scrollIntoView({ behavior: "smooth" });
      });
    }
  }

  #setupNavigationList() {
    const isLogin = !!getAccessToken();
    const navListMain = this.#drawerNavigation.children.namedItem("navlist-main");
    const navList = this.#drawerNavigation.children.namedItem("navlist");

    if (!isLogin) {
      navListMain.innerHTML = "";
      navList.innerHTML = generateUnauthenticatedNavigationListTemplate();
      return;
    }

    navListMain.innerHTML = generateMainNavigationListTemplate();
    navList.innerHTML = generateAuthenticatedNavigationListTemplate();

    const logoutButton = document.getElementById("logout-button");
    logoutButton.addEventListener("click", (event) => {
      event.preventDefault();

      if (confirm("Are you sure to Logout?")) {
        getLogout();

        location.hash = "/";
      }
    });
  }

  async renderPage() {
    const url = getActiveRoute();
    const prevUrl = this.currentUrl || '/';
    this.currentUrl = url;

    // Cek apakah rute ada
    const route = routes[url] || routes['404'];
    const page = route();

    // Tentukan jenis transisi berdasarkan navigasi
    let transitionType = 'default';

    // Deteksi apakah navigasi maju atau mundur
    if (url === '/' && prevUrl !== '/') {
      transitionType = 'backward';
    } else if (url.includes('/details/') && !prevUrl.includes('/details/')) {
      transitionType = 'detail';
    } else if (prevUrl.includes('/details/') && !url.includes('/details/')) {
      transitionType = 'exit-detail';
    } else if (url !== prevUrl) {
      transitionType = 'forward';
    }

    const transition = transitionHelper({
      updateDOM: async () => {
        this.#content.innerHTML = await page.render(); // Render halaman
        page.afterRender(); // Panggil afterRender() dari halaman
      },
      transitionType: transitionType,
    });

    transition.ready.catch(console.error);
    transition.updateCallbackDone.then(() => {
    scrollTo({ top: 0, behavior: "instant" });
    this.#setupNavigationList(); // Setup navigation setelah halaman selesai di-render
    });
  }
}
