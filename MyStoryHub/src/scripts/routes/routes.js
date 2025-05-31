import RegisterPage from '../pages/profile/register/register-page';
import LoginPage from '../pages/profile/login/login-page';
import HomePage from '../pages/home/home-page';
import FavoritePage from '../pages/favorite/favorite-page';
import StoryDetailsPage from '../pages/story-details/story-details-page';
import AddPage from '../pages/add/add-page';
import BerandaPage from '../pages/beranda/beranda-page';
import NotFoundPage from '../pages/not-found/not-found-page';
import { checkAuthenticatedRoute, checkUnauthenticatedRouteOnly } from '../utils/profile';

export const routes = {
  '/': () => new BerandaPage(),
  '/login': () => checkUnauthenticatedRouteOnly(new LoginPage()),
  '/register': () => checkUnauthenticatedRouteOnly(new RegisterPage()),
  '/home': () => checkAuthenticatedRoute(new HomePage()),
  '/add': () => checkAuthenticatedRoute(new AddPage()),
  '/story-details/:id': () => checkAuthenticatedRoute(new StoryDetailsPage()),
  '/favorite': () => checkAuthenticatedRoute(new FavoritePage()),

// Untuk rute 404
  '404': () => checkAuthenticatedRoute (new NotFoundPage()),
};
