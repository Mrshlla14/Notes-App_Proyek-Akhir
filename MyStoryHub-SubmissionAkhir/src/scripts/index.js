import "../styles/styles.css";
import "../styles/beranda.css";
import "../styles/home.css";
import "../styles/profile.css";
import "../styles/add.css";
import "../styles/favorite.css";
import "../styles/maps.css";
import "../styles/responsive.css";
import '../styles/notification.css';
import '../styles/not-found.css'; 
import 'tiny-slider/dist/tiny-slider.css';
import 'leaflet/dist/leaflet.css';
import App from "./pages/app";
import Camera from "./utils/camera";

// Kode untuk mendaftarkan service worker
const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      // Hanya daftarkan service worker di production
      if (process.env.NODE_ENV === 'production') {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service worker berhasil didaftarkan:', registration);

        // Kode untuk menangani pembaruan service worker
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Ada pembaruan tersedia
              if (confirm('Versi baru aplikasi tersedia. Muat ulang sekarang?')) {
                window.location.reload();
              }
            }
          });
        });
      } else {
        console.log('Mode development: Service worker tidak didaftarkan');
      }
    } catch (error) {
      console.error('Gagal mendaftarkan service worker:', error);
    }
  }
};

// Panggil fungsi untuk mendaftarkan service worker
window.addEventListener('load', registerServiceWorker);

// Kode aplikasi utama
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
