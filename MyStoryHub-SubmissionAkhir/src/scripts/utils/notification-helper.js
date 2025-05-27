import { BASE_URL } from "../config";

const NotificationHelper = {
  async requestPermission() {
    if (!("Notification" in window)) {
      console.error("Browser ini tidak mendukung notifikasi");
      return false;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.error("Izin notifikasi tidak diberikan");
      return false;
    }

    return true;
  },

  async registerServiceWorker() {
    if (!("serviceWorker" in navigator)) {
      console.error("Service Worker tidak didukung di browser ini");
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.register("/sw.js");
      console.log("Service worker berhasil didaftarkan", registration);
      return registration;
    } catch (error) {
      console.error("Gagal mendaftarkan service worker:", error);
      return null;
    }
  },

  async subscribeNotification(registration) {
    try {
      const response = await fetch(`${BASE_URL}/notification/vapidPublicKey`);
      const { data } = await response.json();
      const vapidPublicKey = data.vapidPublicKey;

      const convertedVapidKey = this._urlBase64ToUint8Array(vapidPublicKey);

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
      });

      await this._sendSubscription(subscription);
      return subscription;
    } catch (error) {
      console.error("Gagal berlangganan notifikasi:", error);
      return null;
    }
  },

  async _sendSubscription(subscription) {
    const response = await fetch(`${BASE_URL}/notification/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({
        endpoint: subscription.endpoint,
        keys: {
          p256dh: btoa(
            String.fromCharCode.apply(
              null,
              new Uint8Array(subscription.getKey("p256dh"))
            )
          ),
          auth: btoa(
            String.fromCharCode.apply(
              null,
              new Uint8Array(subscription.getKey("auth"))
            )
          ),
        },
      }),
    });

    return response.json();
  },

  _urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; i++) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  },
};

export default NotificationHelper;
