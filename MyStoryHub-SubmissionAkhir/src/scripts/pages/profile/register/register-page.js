import RegisterPresenter from "./register-presenter";
import * as StoryAPI from "../../../data/api";

export default class RegisterPage {
  #presenter = null;

  async render() {
    return `
      <section class="profile-container">
        <div class="profile-card">
          <div class="profile-header">
            <h1 class="profile-title">Register Account</h1>
          </div>

          <form id="register-form" class="profile-form">
           <div class="form-control">
          <label for="name-input" class="form-label" style="display: flex; align-items: center; gap: 10px;">
            Full Name
          </label>
          <div class="input-group">
           <i class="fas fa-user input-icon"></i>
            <input 
              id="name-input" 
              type="text" 
              name="name" 
              placeholder="Enter your full name" 
              aria-describedby="name-help"
              required
            >
          </div>
        </div>

        <div class="form-control">
          <label for="email-input" class="form-label" style="display: flex; align-items: center; gap: 10px;">
            Email
          </label>
          <div class="input-group">
          <i class="fas fa-envelope input-icon"></i>
            <input 
              id="email-input" 
              type="email" 
              name="email" 
              placeholder="example@email.com" 
              aria-describedby="email-help"
              required
            >
          </div>
        </div>

        <div class="form-control">
          <label for="password-input" class="form-label" style="display: flex; align-items: center; gap: 10px;">
            Password
          </label>
          <div class="input-group">
           <i class="fas fa-lock input-icon"></i>
            <input 
              id="password-input" 
              type="password" 
              name="password" 
              placeholder="Create a password" 
              aria-describedby="password-help"
              required
              minlength="8"
            >
          </div>
        </div>
            
            <div class="form-buttons profile-form-buttons">
            <div id="submit-button-container" style="text-align: center;">
            <p class="profile-alternate-action">Already have an account? <a href="#/login">Login</a></p>
                <button class="btn profile-submit-btn" type="submit" aria-label="Register">Register</button>
            </div>
          </div>
          </form>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new RegisterPresenter({
      view: this,
      model: StoryAPI,
    });

    this.#setupForm();
  }

  #setupForm() {
    document
      .getElementById("register-form")
      .addEventListener("submit", async (event) => {
        event.preventDefault();

        const data = {
          name: document.getElementById("name-input").value,
          email: document.getElementById("email-input").value,
          password: document.getElementById("password-input").value,
        };
        await this.#presenter.getRegistered(data);
      });
  }

  registeredSuccessfully(message) {
    console.log(message);

    // Redirect
    location.hash = "/login";
  }

  registeredFailed(message) {
    alert(message);
  }

  showSubmitLoadingButton() {
    document.getElementById("submit-button-container").innerHTML = `
      <button class="btn profile-submit-btn" type="submit" disabled aria-label="Register">
        <i class="fas fa-spinner loader-button"></i> Creating Account
      </button>
    `;
  }

  hideSubmitLoadingButton() {
    document.getElementById("submit-button-container").innerHTML = `
      <button class="btn profile-submit-btn" type="submit" aria-label="Register">Register</button>
    `;
  }
}
