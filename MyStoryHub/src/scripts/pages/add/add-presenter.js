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
      this.#view.showError('Failed to load map. Please check your internet connection and try again.');
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

      if (response.data && response.data.id) {
        // No need to wait response
        this.#notifyToAllUser(response.data.id);
      } else {
        console.warn('postNewStory: Story created but no ID returned');
      }

      this.#view.storeSuccessfully(response.message, response.data);
    } catch (error) {
      console.error("postNewStory: error:", error);
      this.#view.storeFailed(error.message || 'Failed to create story');
    } finally {
      this.#view.hideSubmitLoadingButton();
    }
  }

  async #notifyToAllUser(storyId) {
    try {
      const response = await this.#model.sendReportToAllUserViaNotification(storyId);
      if (!response.ok) {
        console.error('#notifyToAllUser: response:', response);
        return false;
      }
      return true;
    } catch (error) {
      console.error('#notifyToAllUser: error:', error);
      return false;
    }
  }
}
