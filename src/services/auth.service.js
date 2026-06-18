import api from './api';
import Cookies from 'js-cookie';

const COOKIE_OPTIONS = { expires: 7, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' };

export const authService = {
  async register(data) {
    const result = await api.post('/auth/register', data);
    return result;
  },

  async login(email, password) {
    const result = await api.post('/auth/login', { email, password });
    if (result.success && result.token) {
      Cookies.set('brainwave_token', result.token, COOKIE_OPTIONS);
    }
    return result;
  },

  async googleLogin(googleData) {
    const result = await api.post('/auth/google', googleData);
    if (result.success && result.token) {
      Cookies.set('brainwave_token', result.token, COOKIE_OPTIONS);
    }
    return result;
  },

  async logout() {
    Cookies.remove('brainwave_token');
    return { success: true };
  },

  async getMe() {
    return api.get('/auth/me');
  },

  async verifyEmail(token) {
    return api.post('/auth/verify-email', { token });
  },

  async forgotPassword(email) {
    return api.post('/auth/forgot-password', { email });
  },

  async resetPassword(token, newPassword) {
    return api.post('/auth/reset-password', { token, newPassword });
  },

  getToken() {
    return Cookies.get('brainwave_token');
  },

  isLoggedIn() {
    return !!this.getToken();
  },
};
