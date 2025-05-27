export default class BerandaPage {
  async render() {
    return `
      <section class="beranda-container">
        <div class="beranda-content">
          <div class="beranda-header">
            <h1 class="beranda-title">Welcome to MyStoryHub</h1>
          </div>
          
          <div class="beranda-description">
            <p>Share Your Stories With Me.</p>
          </div>
      </section>
    `;
  }

  async afterRender() {
    const elements = document.querySelectorAll(
      ".beranda-header, .beranda-description"
    );

    elements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add("fade-in");
      }, 100 * index);
    });
  }
}
