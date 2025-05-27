export default class AddPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async showNewFormMap() {
    this.#view.showMapLoading();
    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error("showNewFormMap: error:", error);
      this.#view.showErrorMessage("Terjadi masalah saat memuat peta, silakan coba lagi nanti.");
    } finally {
      this.#view.hideMapLoading();
    }
  }

  async postNewStory({ description, photo, lat, lon }) {
    this.#view.showSubmitLoadingButton();
    try {
      const data = {
        description,
        photo,
        lat,
        lon,
      };
      const response = await this.#model.storeNewStory(data);

      if (!response.ok) {
        console.error("postNewStory: response:", response);
        this.#view.storeFailed(response.message);
        return;
      }

      this.#view.storeSuccessfully(response.message, response.data);
    } catch (error) {
      console.error("postNewStory: error:", error);
      this.#view.storeFailed(error.message);
    } finally {
      this.#view.hideSubmitLoadingButton();
    }
  }
}
