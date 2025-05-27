import { getActiveRoute } from "../routes/url-parser";
import { ACCESS_TOKEN_KEY } from "../config";

export function getAccessToken() {
  try {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

    if (accessToken === "null" || accessToken === "undefined") {
      return null;
    }

    return accessToken;
  } catch (error) {
    console.error("getAccessToken: error:", error);
    return null;
  }
}

export function putAccessToken(token) {
  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    return true;
  } catch (error) {
    console.error("putAccessToken: error:", error);
    return false;
  }
}

export function removeAccessToken() {
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    return true;
  } catch (error) {
    console.error("getLogout: error:", error);
    return false;
  }
}

const unauthenticatedRoutesOnly = ["/login", "/register"];

export function checkUnauthenticatedRouteOnly(page) {
  const url = getActiveRoute();
  const isLogin = !!getAccessToken();

  if (unauthenticatedRoutesOnly.includes(url) && isLogin) {
    location.hash = "/";
    return null;
  }

  return page;
}

export function checkAuthenticatedRoute(page) {
  const isLogin = !!getAccessToken();

  if (!isLogin) {
    location.hash = "/login";
    return null;
  }

  return page;
}

export function getLogout() {
  removeAccessToken();
}

export function getFavoriteStories() {
  try {
    const favoriteStories = localStorage.getItem("favoriteStories");
    return favoriteStories ? JSON.parse(favoriteStories) : [];
  } catch (error) {
    console.error("getFavoriteStories: error:", error);
    return [];
  }
}

export function addFavoriteStory(story) {
  try {
    const favoriteStories = getFavoriteStories();
    if (!favoriteStories.some((s) => s.id === story.id)) {
      favoriteStories.push(story);
      localStorage.setItem("favoriteStories", JSON.stringify(favoriteStories));
    }
    return true;
  } catch (error) {
    console.error("addFavoriteStory: error:", error);
    return false;
  }
}

export function removeFavoriteStory(storyId) {
  try {
    let favoriteStories = getFavoriteStories();
    favoriteStories = favoriteStories.filter((story) => story.id !== storyId);
    localStorage.setItem("favoriteStories", JSON.stringify(favoriteStories));
    return true;
  } catch (error) {
    console.error("removeFavoriteStory: error:", error);
    return false;
  }
}

export function isStoryFavorite(storyId) {
  try {
    const favoriteStories = getFavoriteStories();
    return favoriteStories.some((story) => story.id === storyId);
  } catch (error) {
    console.error("isStoryFavorite: error:", error);
    return false;
  }
}
