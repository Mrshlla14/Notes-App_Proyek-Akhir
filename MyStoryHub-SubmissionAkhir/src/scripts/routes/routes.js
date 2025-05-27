import BerandaPage from '../pages/beranda/beranda-page';
import RegisterPage from '../pages/profile/register/register-page';
import LoginPage from '../pages/profile/login/login-page';
import HomePage from '../pages/home/home-page';
import AddPage from '../pages/add/add-page';
import DetailsPage from '../pages/details/details-page';
import FavoritePage from '../pages/favorite/favorite-page';
import NotFoundPage from '../pages/not-found/not-found-page';
import { checkAuthenticatedRoute, checkUnauthenticatedRouteOnly } from '../utils/profile';

export const routes = {
  '/': () => new BerandaPage(),
  '/login': () => checkUnauthenticatedRouteOnly(new LoginPage()),
  '/register': () => checkUnauthenticatedRouteOnly(new RegisterPage()),
  '/home': () => checkAuthenticatedRoute(new HomePage()),
  '/add': () => checkAuthenticatedRoute(new AddPage()),
  '/details/:id': () => checkAuthenticatedRoute(new DetailsPage()),
  '/favorite': () => checkAuthenticatedRoute(new FavoritePage()),

// Untuk rute 404
  '404': () => checkAuthenticatedRoute (new NotFoundPage()),
};
