export default class NotFoundPage {
  async render() {
    return `
      <section class="not-found-container">
        <div class="not-found-content">
          <div class="not-found-icon">
            <i class="fas fa-map-signs"></i>
          </div>
          <h1 class="not-found-title">404 - Page Not Found</h1>
            <a href="#/home" class="btn">Back To Home</a>
            <a href="#/add" class="btn btn-outline">Share Story</a>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    // Animasi sederhana untuk halaman 404
    const elements = document.querySelectorAll(
      '.not-found-icon, .not-found-title, .not-found-message, .not-found-submessage, .not-found-actions',
    );

    elements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('fade-in');
      }, 100 * index);
    });
  }
}
