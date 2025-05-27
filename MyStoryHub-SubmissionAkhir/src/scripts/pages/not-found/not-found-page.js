export default class NotFoundPage {
  async render() {
    return `
      <section class="not-found-container">
        <div class="not-found-content">
          <div class="not-found-icon">
            <i class="fas fa-map-signs"></i>
          </div>
          <h1 class="not-found-title">404 - Halaman Tidak Ditemukan</h1>
          <p class="not-found-message">Maaf, halaman yang Anda cari tidak dapat ditemukan.</p>
          <p class="not-found-submessage">Mungkin halaman telah dipindahkan atau URL yang Anda masukkan salah.</p>
          <div class="not-found-actions">
            <a href="#/home" class="btn">Kembali ke Beranda</a>
            <a href="#/new" class="btn btn-outline">Bagikan Cerita</a>
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